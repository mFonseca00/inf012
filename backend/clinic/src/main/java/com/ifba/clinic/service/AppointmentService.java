package com.ifba.clinic.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.appointment.AppointmentCancelationDTO;
import com.ifba.clinic.dto.appointment.AppointmentConclusionDTO;
import com.ifba.clinic.dto.appointment.AppointmentRegDTO;
import com.ifba.clinic.dto.appointment.AppointmentResponseDTO;
import com.ifba.clinic.exception.AppointmentConflictException;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.model.entity.Appointment;
import com.ifba.clinic.model.entity.AppointmentCancelation;
import com.ifba.clinic.model.entity.Doctor;
import com.ifba.clinic.model.entity.Patient;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.AppointmentStatus;
import com.ifba.clinic.repository.AppointmentCancelationRepository;
import com.ifba.clinic.repository.AppointmentRepository;
import com.ifba.clinic.repository.DoctorRepository;
import com.ifba.clinic.repository.PatientRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentCancelationRepository appointmentCancelationRepository;
    private final EmailService emailService;
    private final UserService userService;
    private final PatientService patientService;
    private final DoctorService doctorService;

    @SuppressWarnings("unused")
    AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository,
        DoctorRepository doctorRepository, AppointmentCancelationRepository appointmentCancelationRepository,
        EmailService emailService, DoctorService doctorService, PatientService patientService, UserService userService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentCancelationRepository = appointmentCancelationRepository;
        this.emailService = emailService;
        this.userService = userService;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    public void scheduleAppointment(AppointmentRegDTO dto) {
        validateMinimumAdvanceTime(dto.appointmentDate());
        validateClinicOperatingHours(dto.appointmentDate());
        
        Patient patient = validatePatient(dto.patientId(), dto.appointmentDate());
        Doctor doctor = getOrSelectDoctor(dto.doctorId(), dto.appointmentDate());

        validatePatientConflict(patient.getId(), dto.appointmentDate());
        validateDoctorConflict(doctor.getId(), dto.appointmentDate());

        if (patient.getUser().getId().equals(doctor.getUser().getId())) {
            throw new BusinessRuleException(
                "Um médico não pode marcar uma consulta com ele mesmo"
            );
        }

        Appointment appointment = new Appointment(
            patient,
            doctor,
            dto.appointmentDate()
        );
        
        appointmentRepository.save(appointment);
        emailService.sendAppointmentConfirmationToPatient(
            patient.getUser().getId(),
            patient.getUser().getEmail(),
            patient.getName(),
            doctor.getName(),
            dto.appointmentDate()
        );
        emailService.sendAppointmentNotificationToDoctor(
            doctor.getUser().getId(),
            doctor.getUser().getEmail(),
            doctor.getName(),
            patient.getName(),
            dto.appointmentDate()
        );
    }

    public void cancelAppointment(AppointmentCancelationDTO dto) {
        Appointment appointment = appointmentRepository.findById(dto.appointmentId())
            .orElseThrow(() -> new EntityNotFoundException(
                "Consulta não encontrada com ID: " + dto.appointmentId()
            ));
        if (appointment.getAppointmentStatus() != AppointmentStatus.ATIVA) {
            throw new BusinessRuleException(
                "Esta consulta já foi cancelada anteriormente"
            );
        }
        
        validateMinimumCancelationTime(appointment.getAppointmentDate());
        validateCancelationStatus(dto.newStatus());
        
        appointment.setAppointmentStatus(dto.newStatus());
        appointmentRepository.save(appointment);
        
        AppointmentCancelation cancelation = new AppointmentCancelation(
            appointment,
            dto.reason()
        );
        
        appointmentCancelationRepository.save(cancelation);

        Patient patient = appointment.getPatient();
        Doctor doctor = appointment.getDoctor();
        
        emailService.sendAppointmentCancellationToPatient(
            patient.getUser().getId(),
            patient.getUser().getEmail(),
            patient.getName(),
            doctor.getName(),
            appointment.getAppointmentDate(),
            dto.reason()
        );
        emailService.sendAppointmentCancellationToDoctor(
            doctor.getUser().getId(),
            doctor.getUser().getEmail(),
            doctor.getName(),
            patient.getName(),
            appointment.getAppointmentDate(),
            dto.reason()
        );
    }

    public void concludeAppointment(AppointmentConclusionDTO dto) {
        Appointment appointment = appointmentRepository.findById(dto.appointmentId())
            .orElseThrow(() -> new EntityNotFoundException(
                "Consulta não encontrada com ID: " + dto.appointmentId()
            ));
        
        if (appointment.getAppointmentStatus() != AppointmentStatus.ATIVA) {
            throw new BusinessRuleException(
                "Apenas consultas ativas podem ser concluídas"
            );
        }
        
        appointment.setAppointmentStatus(AppointmentStatus.REALIZADA);
        appointmentRepository.save(appointment);
        
        Patient patient = appointment.getPatient();
        Doctor doctor = appointment.getDoctor();
        
        emailService.sendAppointmentCompletionToPatient(
            patient.getUser().getId(),
            patient.getUser().getEmail(),
            patient.getName(),
            doctor.getName(),
            appointment.getAppointmentDate()
        );
        emailService.sendAppointmentCompletionToDoctor(
            doctor.getUser().getId(),
            doctor.getUser().getEmail(),
            doctor.getName(),
            patient.getName(),
            appointment.getAppointmentDate()
        );
    }

    public Page<AppointmentResponseDTO> getAllAppointments(Pageable pageable) {
        Page<Appointment> appointments = appointmentRepository.findAll(pageable);
        return appointments.map(this::convertToDTO);
    }

    public AppointmentResponseDTO getAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Consulta não encontrada com ID: " + id
                ));
        return convertToDTO(appointment);
    }

    public Page<AppointmentResponseDTO> getMyAppointments(String username, String role, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "appointmentDate"));
        User user = userService.findUserByUsername(username);
        if (user.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getRole()) || "MASTER".equals(r.getRole()))) {
            Page<Appointment> appointments = appointmentRepository.findAll(pageable);
            return filterByStatus(appointments, status).map(this::convertToDTO);
        }
        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctorService.getDoctorByUsername(username);
            if (doctor == null) {
                return Page.empty(pageable);
            }
            Page<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId(), pageable);
            return filterByStatus(appointments, status).map(this::convertToDTO);
        }
        if ("PATIENT".equals(role)) {
            Patient patient = patientService.getPatientByUsername(username);
            if (patient == null) {
                return Page.empty(pageable);
            }
            Page<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId(), pageable);
            return filterByStatus(appointments, status).map(this::convertToDTO);
        }
        boolean isDoctor = user.getRoles().stream().anyMatch(r -> "DOCTOR".equals(r.getRole()));
        boolean isPatient = user.getRoles().stream().anyMatch(r -> "PATIENT".equals(r.getRole()));
        if (isDoctor && !isPatient) {
            Doctor doctor = doctorService.getDoctorByUsername(username);
            if (doctor == null) {
                return Page.empty(pageable);
            }
            Page<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId(), pageable);
            return filterByStatus(appointments, status).map(this::convertToDTO);
        }
        if (isPatient) {
            Patient patient = patientService.getPatientByUsername(username);
            if (patient == null) {
                return Page.empty(pageable);
            }
            Page<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId(), pageable);
            return filterByStatus(appointments, status).map(this::convertToDTO);
        }
        return Page.empty(pageable);
    }


    // Helper Methods
    private void validateMinimumAdvanceTime(LocalDateTime appointmentDate) {
        LocalDateTime minimumTime = LocalDateTime.now().plusMinutes(30);
        if (appointmentDate.isBefore(minimumTime)) {
            throw new BusinessRuleException(
                "Consultas devem ser agendadas com antecedência mínima de 30 minutos"
            );
        }
    }

    private void validateClinicOperatingHours(LocalDateTime appointmentDate) {
        DayOfWeek dayOfWeek = appointmentDate.getDayOfWeek();
        int hour = appointmentDate.getHour();
        if (dayOfWeek == DayOfWeek.SUNDAY) {
            throw new BusinessRuleException(
                "A clínica não funciona aos domingos"
            );
        }
        if (hour < 7 || hour >= 19) {
            throw new BusinessRuleException(
                "Horário de funcionamento da clínica: Segunda a Sábado, das 07:00 às 19:00"
            );
        }
        LocalDateTime endTime = appointmentDate.plusHours(1);
        if (endTime.getHour() > 19 || (endTime.getHour() == 19 && endTime.getMinute() > 0)) {
            throw new BusinessRuleException(
                "A consulta não pode ser agendada neste horário pois terminaria após o fechamento da clínica (19:00)"
            );
        }
    }

    private void validateMinimumCancelationTime(LocalDateTime appointmentDate) {
        LocalDateTime minimumTime = LocalDateTime.now().plusHours(24);
        if (appointmentDate.isBefore(minimumTime)) {
            throw new BusinessRuleException(
                "Consultas só podem ser canceladas com antecedência mínima de 24 horas"
            );
        }
    }

    private void validateCancelationStatus(AppointmentStatus newStatus) {
        if (newStatus != AppointmentStatus.CANCELADA && 
            newStatus != AppointmentStatus.DESISTENCIA) {
            throw new BusinessRuleException(
                "Status de cancelamento inválido. " +
                "Motivo de cancelamento deve ser: CANCELADA (médico cancelou), " +
                "DESISTENCIA (paciente desistiu) ou OUTRO (outros motivos)"
            );
        }
    }

    private Patient validatePatient(Long patientId, LocalDateTime appointmentDate) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new EntityNotFoundException(
                "Paciente não encontrado com ID: " + patientId
            ));
        if (!patient.getIsActive()) {
            throw new BusinessRuleException(
                "Não é possível agendar consulta para paciente inativo"
            );
        }
        LocalDateTime startOfDay = appointmentDate.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = appointmentDate.toLocalDate().atTime(23, 59, 59);
        if (appointmentRepository.existsByPatientIdAndAppointmentDateBetween(
                patientId, startOfDay, endOfDay)) {
            throw new BusinessRuleException(
                "Paciente já possui consulta agendada neste dia"
            );
        }
        return patient;
    }

    private Doctor getOrSelectDoctor(Long doctorId, LocalDateTime appointmentDate) {
        Doctor doctor;
        LocalDateTime endTime = appointmentDate.plusHours(1);
        if (doctorId != null) {
            doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException(
                    "Médico não encontrado com ID: " + doctorId
                ));
        } else {
            List<Doctor> availableDoctors = appointmentRepository
                .findAvailableDoctors(appointmentDate, endTime);
            if (availableDoctors.isEmpty()) {
                throw new BusinessRuleException(
                    "Não há médicos disponíveis para este horário"
                );
            }
            doctor = availableDoctors.get(new Random().nextInt(availableDoctors.size()));
        }
        if (!doctor.getIsActive()) {
            throw new BusinessRuleException(
                "Não é possível agendar consulta com médico inativo"
            );
        }
        if (appointmentRepository.existsByDoctorIdAndAppointmentDateBetween(
                doctor.getId(), appointmentDate, endTime)) {
            throw new BusinessRuleException(
                "Médico já possui consulta agendada neste horário"
            );
        }
        return doctor;
    }

    private AppointmentResponseDTO convertToDTO(Appointment appointment) {
        return new AppointmentResponseDTO(
            appointment.getId(),
            appointment.getPatient().getId(),
            appointment.getPatient().getName(),
            appointment.getDoctor().getId(),
            appointment.getDoctor().getName(),
            appointment.getDoctor().getSpeciality().name(),
            appointment.getAppointmentDate(),
            appointment.getAppointmentStatus()
        );
    }

    private Page<Appointment> filterByStatus(Page<Appointment> appointments, String status) {
        if (status == null || status.isEmpty()) {
            return appointments;
        }
        
        try {
            AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
            List<Appointment> filtered = appointments.getContent().stream()
                .filter(a -> a.getAppointmentStatus() == appointmentStatus)
                .toList();
            return new PageImpl<>(filtered, appointments.getPageable(), filtered.size());
        } catch (IllegalArgumentException e) {
            return appointments;
        }
    }

    private void validatePatientConflict(Long patientId, LocalDateTime appointmentDate) {
        List<Appointment> conflicts = appointmentRepository
            .findConflictingAppointmentForPatient(patientId, appointmentDate);
        
        if (!conflicts.isEmpty()) {
            throw new AppointmentConflictException(
                "Paciente já possui uma consulta agendada para este horário"
            );
        }
    }

    private void validateDoctorConflict(Long doctorId, LocalDateTime appointmentDate) {
        List<Appointment> conflicts = appointmentRepository
            .findConflictingAppointmentForDoctor(doctorId, appointmentDate);
        
        if (!conflicts.isEmpty()) {
            throw new AppointmentConflictException(
                "Médico já possui uma consulta agendada para este horário"
            );
        }
    }
}

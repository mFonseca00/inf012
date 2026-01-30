package com.ifba.clinic.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.appointment.AppointmentCancelationDTO;
import com.ifba.clinic.dto.appointment.AppointmentConclusionDTO;
import com.ifba.clinic.dto.appointment.AppointmentRegDTO;
import com.ifba.clinic.dto.appointment.AppointmentResponseDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.model.entity.Appointment;
import com.ifba.clinic.model.entity.AppointmentCancelation;
import com.ifba.clinic.model.entity.Doctor;
import com.ifba.clinic.model.entity.Patient;
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

    @SuppressWarnings("unused")
    AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository,
        DoctorRepository doctorRepository, AppointmentCancelationRepository appointmentCancelationRepository,
        EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentCancelationRepository = appointmentCancelationRepository;
        this.emailService = emailService;
    }

    public void scheduleAppointment(AppointmentRegDTO dto) {
        validateMinimumAdvanceTime(dto.appointmentDate());
        validateClinicOperatingHours(dto.appointmentDate());
        
        Patient patient = validatePatient(dto.patientId(), dto.appointmentDate());
        Doctor doctor = getOrSelectDoctor(dto.doctorId(), dto.appointmentDate());
        
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
        if (appointment.getAppointmentStatus() != AppointmentStatus.ATIVO) {
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
        
        if (appointment.getAppointmentStatus() != AppointmentStatus.ATIVO) {
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
        return appointments.map(appointment -> new AppointmentResponseDTO(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentStatus()
        ));
    }

    public AppointmentResponseDTO getAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Consulta não encontrada com ID: " + id
                ));
        return new AppointmentResponseDTO(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentStatus()
        );
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
        if (newStatus != AppointmentStatus.CANCELADO && 
            newStatus != AppointmentStatus.DESISTENCIA) {
            throw new BusinessRuleException(
                "Status de cancelamento inválido. " +
                "Motivo de cancelamento deve ser: CANCELADO (médico cancelou), " +
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
}

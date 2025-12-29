package com.ifba.clinic.service;

import com.ifba.clinic.dto.appointment.AppointmentCancelationDTO;
import com.ifba.clinic.dto.appointment.AppointmentRegDTO;
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
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentCancelationRepository appointmentCancelationRepository;

    AppointmentService(AppointmentRepository appointmentRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, AppointmentCancelationRepository appointmentCancelationRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentCancelationRepository = appointmentCancelationRepository;
    }

    public void scheduleAppointment(AppointmentRegDTO dto) {
        validateMinimumAdvanceTime(dto.appointmentDate());
        validateClinicOperatingHours(dto.appointmentDate());
        
        Patient patient = validatePatient(dto.patientId(), dto.appointmentDate());
        Doctor doctor = getOrSelectDoctor(dto.doctorId(), dto.appointmentDate());
        
        Appointment appointment = new Appointment(
            patient,
            doctor,
            dto.appointmentDate()
        );
        
        appointmentRepository.save(appointment);
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
            newStatus != AppointmentStatus.DESISTENCIA && 
            newStatus != AppointmentStatus.OUTRO) {
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

package com.ifba.clinic.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ifba.clinic.model.entity.Appointment;
import com.ifba.clinic.model.entity.Doctor;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByPatientIdAndAppointmentDateBetween(Long patientId, LocalDateTime startOfDay, LocalDateTime endOfDay);
    boolean existsByDoctorIdAndAppointmentDateBetween(Long doctorId, LocalDateTime startTime, LocalDateTime endTime);
    @Query("SELECT d FROM Doctor d WHERE d.isActive = true " +
            "AND d.id NOT IN (SELECT a.doctor.id FROM Appointment a " +
            "WHERE a.appointmentDate BETWEEN :startTime AND :endTime " +
            "AND a.appointmentStatus = 'ATIVA')")
    List<Doctor> findAvailableDoctors(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);
    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    // Verifica se o paciente tem consulta ativa no dia
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
            "AND a.appointmentDate >= :startOfDay " +
            "AND a.appointmentDate <= :endOfDay " +
            "AND a.appointmentStatus NOT IN ('CANCELADA', 'DESISTENCIA')")
    List<Appointment> findActiveAppointmentsByPatientAndDay(
            @Param("patientId") Long patientId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    // Verifica se há conflito de horário para o médico (se o médico já tem outra consulta no mesmo horário)
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentStatus NOT IN ('CANCELADA', 'DESISTENCIA') " +
            "AND a.appointmentDate >= :startRange " +
            "AND a.appointmentDate <= :endRange")
    List<Appointment> findConflictingAppointmentForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("startRange") LocalDateTime startRange,
            @Param("endRange") LocalDateTime endRange
    );

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
            "AND a.appointmentStatus NOT IN ('CANCELADA', 'DESISTENCIA') " +
            "AND a.appointmentDate < :end")
    List<Appointment> findPotentiallyConflictingAppointments(
            @Param("doctorId") Long doctorId,
            @Param("end") LocalDateTime end
    );

}

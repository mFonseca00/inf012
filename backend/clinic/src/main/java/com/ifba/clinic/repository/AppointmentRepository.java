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
            "AND a.appointmentStatus = 'ATIVO')")
    List<Doctor> findAvailableDoctors(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);
    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

}

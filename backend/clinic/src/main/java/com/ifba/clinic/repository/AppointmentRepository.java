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

    // ========================================================================
    // 1. CONFLITOS E VALIDAÇÕES (MÉDICO E PACIENTE)
    // ========================================================================

    // [NOVO] Verifica conflito do médico por INTERVALO (Regra do 8:00 vs 8:01)
    // Ignora status de cancelamento/desistência
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentStatus NOT IN ('CANCELADA', 'DESISTENCIA') " +
           "AND a.appointmentDate >= :startRange " +
           "AND a.appointmentDate <= :endRange")
    List<Appointment> findConflictingAppointmentForDoctor(
        @Param("doctorId") Long doctorId,
        @Param("startRange") LocalDateTime startRange,
        @Param("endRange") LocalDateTime endRange
    );

    // Verifica conflito do paciente (Horário exato)
    // Ignora status de cancelamento/desistência
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate = :appointmentDate " +
           "AND a.appointmentStatus NOT IN ('CANCELADA', 'DESISTENCIA')")
    List<Appointment> findConflictingAppointmentForPatient(
        @Param("patientId") Long patientId,
        @Param("appointmentDate") LocalDateTime appointmentDate
    );

    // [CORREÇÃO] Busca histórico do dia do paciente
    // Alterado de 'existsBy...' (boolean) para retornar a LISTA.
    // Isso permite que o Service filtre manualmente os cancelados para não bloquear o paciente injustamente.
    List<Appointment> findByPatientIdAndAppointmentDateBetween(
        Long patientId, 
        LocalDateTime startOfDay, 
        LocalDateTime endOfDay
    );

    // ========================================================================
    // 2. BUSCA DE MÉDICOS DISPONÍVEIS
    // ========================================================================

    // Retorna médicos ativos que NÃO têm consulta ativa no horário solicitado
    @Query("SELECT d FROM Doctor d WHERE d.isActive = true " +
           "AND d.id NOT IN (" +
           "  SELECT a.doctor.id FROM Appointment a " +
           "  WHERE a.appointmentDate = :date " +
           "  AND a.appointmentStatus NOT IN ('CANCELADA', 'DESISTENCIA')" +
           ")")
    List<Doctor> findAvailableDoctors(
        @Param("date") LocalDateTime date,
        @Param("endTime") LocalDateTime endTime // Mantido para compatibilidade da assinatura, mesmo se não usado na query
    );

    // ========================================================================
    // 3. PAGINAÇÃO E LISTAGEM
    // ========================================================================

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);
    
    Page<Appointment> findByDoctorId(Long doctorId, Pageable pageable);

    // ========================================================================
    // 4. MÉTODOS LEGADOS (Depreciados ou Mantidos por Compatibilidade)
    // ========================================================================
    
    // Se você não usa mais este método no Service antigo, pode remover.
    // Se ainda usa, ele está aqui, mas cuidado: ele retorna TRUE mesmo para cancelados.
    boolean existsByDoctorIdAndAppointmentDateBetween(Long doctorId, LocalDateTime startTime, LocalDateTime endTime);
    
    // Mantive este caso você ainda tenha alguma referência antiga, 
    // mas o ideal é usar o 'findByPatientIdAndAppointmentDateBetween' (lista)
    boolean existsByPatientIdAndAppointmentDateBetween(Long patientId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
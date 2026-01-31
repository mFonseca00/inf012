package com.ifba.clinic.dto.appointment;

import java.time.LocalDateTime;

import com.ifba.clinic.model.enums.AppointmentStatus;

public record AppointmentResponseDTO(
        Long id,
        Long patientId,
        String patientName,
        Long doctorId,
        String doctorName,
        String doctorSpeciality,
        LocalDateTime appointmentDate,
        AppointmentStatus appointmentStatus
) { }

package com.ifba.clinic.dto.appointment;

import com.ifba.clinic.model.enums.AppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentResponseDTO(
        Long id,
        Long patientId,
        String patientName,
        Long doctorId,
        String doctorName,
        LocalDateTime appointmentDate,
        AppointmentStatus appointmentStatus
) { }

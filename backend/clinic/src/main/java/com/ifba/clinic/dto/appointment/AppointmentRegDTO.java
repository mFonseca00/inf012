package com.ifba.clinic.dto.appointment;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record AppointmentRegDTO(
        @NotNull(message = "ID do paciente é obrigatório")
        Long patientId,

        Long doctorId,

        @NotNull(message = "Data e hora da consulta é obrigatória")
        @Future(message = "Data e hora da consulta devem ser futuras")
        LocalDateTime appointmentDate
) { }

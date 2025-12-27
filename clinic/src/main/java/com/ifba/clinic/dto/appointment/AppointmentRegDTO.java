package com.ifba.clinic.dto.appointment;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record AppointmentRegDTO(
        @NotNull(message = "ID do paciente é obrigatório")
        Long patientId,

        @NotNull(message = "ID do médico é obrigatório")
        Long doctorId,

        @NotNull(message = "Data e hora da consulta é obrigatória")
        @Future(message = "Data e hora da consulta devem ser futuras")
        LocalDateTime appointmentDate
) { }

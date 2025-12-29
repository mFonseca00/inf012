package com.ifba.clinic.dto.appointment;

import com.ifba.clinic.model.enums.AppointmentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AppointmentCancelationDTO(
    @NotNull(message = "ID da consulta é obrigatório")
    Long appointmentId,
    
    @NotBlank(message = "Motivo do cancelamento é obrigatório")
    String reason,

    @NotNull(message = "Categoria de cancelamento é obrigatória")
    AppointmentStatus newStatus
) { }

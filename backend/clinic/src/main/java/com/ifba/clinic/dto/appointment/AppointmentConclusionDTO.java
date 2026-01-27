package com.ifba.clinic.dto.appointment;

import jakarta.validation.constraints.NotNull;

public record AppointmentConclusionDTO(
    @NotNull(message = "ID da consulta é obrigatório")
    Long appointmentId
) { }

package com.ifba.clinic.dto.doctor;

import jakarta.validation.constraints.NotBlank;

public record DoctorinactivationDTO(
        @NotBlank(message = "CRM obrigatório")
        String crm
) { }

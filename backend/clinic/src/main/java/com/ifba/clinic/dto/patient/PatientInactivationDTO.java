package com.ifba.clinic.dto.patient;

import jakarta.validation.constraints.NotBlank;

public record PatientInactivationDTO(
    @NotBlank(message = "CPF é obrigatório")
    String cpf
) { }

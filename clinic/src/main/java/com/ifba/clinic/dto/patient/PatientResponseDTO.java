package com.ifba.clinic.dto.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PatientResponseDTO(
    @NotBlank(message = "CPF é obrigatório")
    String cpf,
    @NotBlank(message = "Nome é obrigatório")
    String name,
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    String email
) { }

package com.ifba.clinic.dto.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record PatientResponseDTO(
    Long id,
    String cpf,
    String name,
    String email,
    boolean isActive
) { }

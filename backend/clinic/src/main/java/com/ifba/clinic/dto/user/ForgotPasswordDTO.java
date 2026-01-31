package com.ifba.clinic.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordDTO(
    @NotBlank(message = "O username é obrigatório")
    String username,
    
    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    String email
) {}
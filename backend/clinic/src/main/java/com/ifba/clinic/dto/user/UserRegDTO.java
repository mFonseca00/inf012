package com.ifba.clinic.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegDTO(
        @NotBlank
        String username,
        @NotBlank
        @Size(min = 8, max = 20, message = "Senha deve ter entre 8 e 20 caracteres")
        @Pattern(regexp = ".*\\d.*", message = "Senha deve conter pelo menos um número")
        @Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*", message = "Senha deve conter pelo menos um caractere especial")
        String password,
        @NotBlank
        @Email
        String email
) { }

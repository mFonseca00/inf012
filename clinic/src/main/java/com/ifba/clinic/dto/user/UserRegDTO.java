package com.ifba.clinic.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRegDTO(
        @NotBlank
        String username,
        @NotBlank
        String password,
        @NotBlank
        @Email
        String email
) { }

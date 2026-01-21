package com.ifba.clinic.dto.user;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDTO(
        @NotBlank
        String newPassword
        ) {}

package com.ifba.clinic.dto.user;

import com.ifba.clinic.model.enums.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChangeRoleDTO(
        @NotBlank
        String username,
        @NotNull
        UserRole role
) { }

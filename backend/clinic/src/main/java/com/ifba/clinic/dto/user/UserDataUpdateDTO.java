package com.ifba.clinic.dto.user;

import com.ifba.clinic.model.entity.Role;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record UserDataUpdateDTO(
        @NotBlank
        String username,
        String email,
        String password,
        List<Role> roles
    )
{}

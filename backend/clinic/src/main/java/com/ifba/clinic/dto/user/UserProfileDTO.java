package com.ifba.clinic.dto.user;

import java.util.List;

public record UserProfileDTO(
        Long userId,
        Long patientId,
        Long doctorId,
        String username,
        String email,
        List<String> roles
) { }

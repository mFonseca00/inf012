package com.ifba.clinic.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserBasicInfoDTO(
        @NotBlank
        String username) {
}

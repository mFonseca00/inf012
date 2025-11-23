package com.ifba.clinic.dto.user;

import java.util.List;

public record UserResponseDTO(Long id, String username, String email, Boolean isActive, List<String> roles) {
}

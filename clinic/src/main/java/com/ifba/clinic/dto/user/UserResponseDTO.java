package com.ifba.clinic.dto.user;

import java.util.List;

public record UserResponseDTO(Long id, String username, String email, List<String> roles) {
}

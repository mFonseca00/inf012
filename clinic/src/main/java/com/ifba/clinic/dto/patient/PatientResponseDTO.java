package com.ifba.clinic.dto.patient;

public record PatientResponseDTO(
    Long id,
    String cpf,
    String name,
    String email,
    boolean isActive
) { }

package com.ifba.clinic.dto.doctor;

import com.ifba.clinic.model.enums.Speciality;

public record DoctorResponseDTO(
    Long id,
    String crm,
    String name,
    String email,
    Speciality speciality,
    boolean isActive
) { }

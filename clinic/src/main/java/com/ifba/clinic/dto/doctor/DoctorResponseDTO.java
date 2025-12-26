package com.ifba.clinic.dto.doctor;

import com.ifba.clinic.model.enums.Speciality;

public record DoctorResponseDTO(
    String crm,
    String name,
    String email,
    Speciality speciality
) { }

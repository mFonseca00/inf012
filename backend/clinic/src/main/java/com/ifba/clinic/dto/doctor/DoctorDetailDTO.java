package com.ifba.clinic.dto.doctor;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.model.enums.Speciality;

public record DoctorDetailDTO(
    Long id,
    String crm,
    String name,
    String email,
    String username,
    String phoneNumber,
    Speciality speciality,
    AddressDTO address,
    boolean isActive
) { }
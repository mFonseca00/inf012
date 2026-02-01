package com.ifba.clinic.dto.patient;

import com.ifba.clinic.dto.address.AddressDTO;

public record PatientDetailDTO(
    Long id,
    String name,
    String email,
    String username,
    String phoneNumber,
    String cpf,
    AddressDTO address,
    boolean isActive
) { }
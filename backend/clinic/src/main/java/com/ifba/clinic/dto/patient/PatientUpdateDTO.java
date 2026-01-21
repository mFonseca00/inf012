package com.ifba.clinic.dto.patient;

import com.ifba.clinic.dto.address.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

public record PatientUpdateDTO(
    @NotBlank(message = "CPF é obrigatório")
    String cpf,
    @NotBlank(message = "Nome é obrigatório")
    String name,
    @NotBlank(message = "Numero de telefone é obrigatório")
    String phoneNumber,
    @NotBlank(message = "CPF é obrigatório")
    @Valid
    AddressDTO address
) { }

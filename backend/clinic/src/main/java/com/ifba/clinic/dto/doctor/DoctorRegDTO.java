package com.ifba.clinic.dto.doctor;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.model.enums.Speciality;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DoctorRegDTO(
        @NotBlank(message = "Nome é obrigatório")
        String name,

        String username,

        @Email(message = "Email inválido")
        String email,

        @NotBlank (message = "Numero de telefone é obrigatório")
        @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}", message = "Número de telefone inválido. Formato esperado: (XX) XXXXX-XXXX")
        String phoneNumber,

        @NotBlank(message = "Numero de telefone é obrigatório")
        @Pattern(regexp = "^\\d{6}-\\d{2}\\/[A-Z]{2}$", message = "CRM inválido. Formato esperado: XXXXXX-XX/UF")
        String crm,

        @NotNull(message = "Especialidade é obrigatória")
        Speciality speciality,

        @NotNull(message = "Endereço é obrigatório")
        @Valid
        AddressDTO address
) { }

package com.ifba.clinic.dto.doctor;

import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.enums.Speciality;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DoctorRegDTO(
        @NotBlank
        String name,

        @NotBlank
        @Email(message = "Email inválido")
        String email,

        @NotBlank (message = "Numero de telefone é obrigatório")
        @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}", message = "Número de telefone inválido. Formato esperado: (XX) XXXXX-XXXX")
        String phoneNumber,

        @NotBlank
        @Pattern(regexp = "^\\d{6}-\\d{2}\\/[A-Z]{2}$", message = "CRM inválido. Formato esperado: XXXXXX-XX/UF")
        String crm,

        @NotNull
        Speciality speciality,

        @NotNull
        @Valid
        Address address
) { }

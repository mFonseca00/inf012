package com.ifba.clinic.dto.patient;

import org.hibernate.validator.constraints.br.CPF;

import com.ifba.clinic.dto.address.AddressDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record PatientRegDTO (

    @NotBlank(message = "Nome é obrigatório")
    String name,

    String username,

    @Email(message = "Email inválido")
    String email,

    @NotBlank (message = "Numero de telefone é obrigatório")
    @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}", message = "Número de telefone inválido. Formato esperado: (XX) XXXXX-XXXX")
    String phoneNumber,

    @NotBlank(message = "CPF é obrigatório")
    @CPF(message = "CPF inválido")
    String cpf,

    @NotNull(message = "Endereço é obrigatório")
    @Valid
    AddressDTO address
){ }

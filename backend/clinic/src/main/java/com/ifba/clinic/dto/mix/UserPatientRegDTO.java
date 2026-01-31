package com.ifba.clinic.dto.mix;

import com.ifba.clinic.dto.address.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.br.CPF;

public record UserPatientRegDTO(
        @NotBlank
        String username,

        @NotBlank
        String password,

        @NotBlank
        @Email
        String email,

        @NotBlank(message = "CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        @NotBlank(message = "Nome é obrigatório")
        String fullName,

        @NotBlank (message = "Numero de telefone é obrigatório")
        @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}", message = "Número de telefone inválido. Formato esperado: (XX) XXXXX-XXXX")
        String phoneNumber,

        @NotNull(message = "Endereço é obrigatório")
        @Valid
        AddressDTO address
) { }


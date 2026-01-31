package com.ifba.clinic.dto.mix;

import org.hibernate.validator.constraints.br.CPF;

import com.ifba.clinic.dto.address.AddressDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserPatientRegDTO(
        @NotBlank
        String username,

        @NotBlank
        @Size(min = 8, max = 20, message = "Senha deve ter entre 8 e 20 caracteres")
        @Pattern(regexp = ".*\\d.*", message = "Senha deve conter pelo menos um número")
        @Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*", message = "Senha deve conter pelo menos um caractere especial")
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


package com.ifba.clinic.dto.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AddressDTO (
    @NotBlank(message = "Rua é obrigatória")
    String street,

    String number,

    String complement,

    @NotBlank(message = "Bairro/distrito é obrigatório")
    String district,

    @NotBlank(message = "Cidade é obrigatória")
    String city,

    @NotBlank(message = "Estado é obrigatório")
    String state,

    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido. Formato esperado: XXXXX-XXX")
    String cep
) { }

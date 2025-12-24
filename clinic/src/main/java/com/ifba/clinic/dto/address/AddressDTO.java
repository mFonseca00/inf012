package com.ifba.clinic.dto.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public record AddressDTO (
    @NotBlank
    String street,

    String number,

    String complement,

    @NotBlank
    String district,

    @NotBlank
    String city,

    @NotBlank
    String state,

    @NotBlank
    @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido. Formato esperado: XXXXX-XXX")
    String cep
) { }

package com.ifba.clinic.model.vo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class PhoneNumber {

    @NotBlank(message = "Código do país é obrigatório")
    private final String countryCode;

    @NotBlank(message = "Código de área é obrigatório")
    @Pattern(regexp = "\\d{2}", message = "Código de área deve ter 2 dígitos")
    private final String areaCode;

    @NotBlank(message = "Número é obrigatório")
    @Pattern(regexp = "\\d{8,9}", message = "Número deve ter 8 ou 9 dígitos")
    private final String number;

    public PhoneNumber(String countryCode, String areaCode, String number) {
        this.countryCode = countryCode;
        this.areaCode = areaCode;
        this.number = number;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public String getNumber() {
        return number;
    }

    @Override
    public String toString() {
        return "+" + countryCode + " (" + areaCode + ") " + number;
    }
}
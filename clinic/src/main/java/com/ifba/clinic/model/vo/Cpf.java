package com.ifba.clinic.model.vo;

import org.hibernate.validator.constraints.br.CPF;
import jakarta.validation.constraints.NotBlank;

public class Cpf {

    @NotBlank(message = "CPF é obrigatório")
    @CPF(message = "CPF inválido")
    private final String cpf;

    public Cpf(String cpf) {
        this.cpf = cpf;
    }

    public String getCpf() {
        return cpf;
    }

    public String getNumbers() {
        return cpf.replaceAll("[^0-9]", "");
    }

    public String getFormatted() {
        String numbers = getNumbers();
        return numbers.substring(0, 3) + "." +
                numbers.substring(3, 6) + "." +
                numbers.substring(6, 9) + "-" +
                numbers.substring(9, 11);
    }
}
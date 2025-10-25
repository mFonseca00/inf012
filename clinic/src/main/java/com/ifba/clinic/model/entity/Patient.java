package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.vo.Cpf;

import com.ifba.clinic.model.vo.PhoneNumber;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotNull
    @Valid
    private PhoneNumber phone;

    @NotNull
    @Valid
    private Cpf cpf;

    @NotNull
    @Valid
    private Address adress;

    private Boolean active = true;
}

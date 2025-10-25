package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.enums.Speciality;
import com.ifba.clinic.model.vo.Crm;

import com.ifba.clinic.model.vo.PhoneNumber;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotNull
    @Valid
    private PhoneNumber phone;

    @NotNull
    @Valid
    private Crm crm;

    @NotBlank
    @Enumerated(EnumType.STRING)
    private Speciality speciality;

    @NotNull
    @Valid
    private Address adress;
    private Boolean active = true;
}

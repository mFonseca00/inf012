package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.enums.Speciality;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email(message = "Email inválido")
    private String email;

    @NotBlank (message = "Numero de telefone é obrigatório")
    @Pattern(regexp = "\\(\\d{2}\\) \\d{4,5}-\\d{4}", message = "Número de telefone inválido. Formato esperado: (XX) XXXXX-XXXX")
    private String phoneNumber;

    @NotBlank
    @Pattern(regexp = "^\\d{6}-\\d{2}\\/[A-Z]{2}$", message = "CRM inválido. Formato esperado: XXXXXX-XX/UF")
    private String crm;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Speciality speciality;

    @NotNull
    @Valid
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    private Boolean active = true;
}

package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.enums.Speciality;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    @Column(unique = true)
    private String crm;

    @Enumerated(EnumType.STRING)
    @Column(name = "speciality", columnDefinition = "speciality_enum")
    private Speciality speciality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    private Boolean isActive = true;
}

package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.enums.Speciality;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String name;

    private String email;

    private String phoneNumber;

    @Column(unique = true)
    private String crm;

    @Enumerated(EnumType.STRING)
    @Column(name = "speciality")
    private Speciality speciality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    private Boolean isActive = true;

    public Doctor(Address address, String crm, String email, String name, String phoneNumber, Speciality speciality, User user) {
        this.address = address;
        this.crm = crm;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.speciality = speciality;
        this.user = user;
    }

    // TODO: Possivel adição futura - Criação de cadastro a partir de cadastro de usuário
}

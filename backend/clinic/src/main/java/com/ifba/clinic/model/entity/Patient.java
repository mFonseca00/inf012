package com.ifba.clinic.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String name;

    //TODO: remover campo duplicado
    private String email;

    private String phoneNumber;

    @Column(unique = true)
    private String cpf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private Address address;

    private Boolean isActive = true;

    public Patient(String name, String email, String phoneNumber, String cpf, Address address, User user) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.cpf = cpf;
        this.address = address;
        this.user = user;
    }
    // TODO: Possivel adição futura - Criação de cadastro a partir de cadastro de usuário
}

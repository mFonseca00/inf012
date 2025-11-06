package com.api.agenda.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String nome;

    private String sobrenome;

    private String email;

    private LocalDateTime dataCriacao;


}

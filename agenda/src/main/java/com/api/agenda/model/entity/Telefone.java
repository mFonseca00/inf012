package com.api.agenda.model.entity;

import com.api.agenda.model.enums.Categoria;
import jakarta.persistence.*;

@Entity
public class Telefone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contato_id", nullable = false)
    private Contato contato;

    private String numero;

    private Categoria categoria;

    private Boolean principal;


}

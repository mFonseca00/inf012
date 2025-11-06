package com.api.agenda.model.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String password;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private List<Role> roles;

}

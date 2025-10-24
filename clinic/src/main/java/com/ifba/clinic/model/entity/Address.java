package com.ifba.clinic.model.entity;

import jakarta.persistence.Entity;

@Entity
public class Address {
    private Long id;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String city;
    private String state;
    private String Cep;

}

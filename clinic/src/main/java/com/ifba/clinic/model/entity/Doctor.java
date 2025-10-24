package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.enums.Speciality;

import jakarta.persistence.Entity;

@Entity
public class Doctor {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String crm;
    private Speciality speciality;
    private Address adress;
    
}

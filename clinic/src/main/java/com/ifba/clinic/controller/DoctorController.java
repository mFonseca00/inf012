package com.ifba.clinic.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.service.DoctorService;

@RestController
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }
}

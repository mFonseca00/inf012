package com.ifba.clinic.controller;

import com.ifba.clinic.service.DoctorService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorController {

    DoctorService doctorService;

    DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }
}

package com.ifba.clinic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.patient.PatientCreationDTO;
import com.ifba.clinic.dto.patient.PatientDTO;
import com.ifba.clinic.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @GetMapping("/create")
    public PatientDTO createPatient(@RequestBody @Valid PatientCreationDTO patient) {

        return null;
    }
}

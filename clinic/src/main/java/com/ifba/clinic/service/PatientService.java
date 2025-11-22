package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    PatientService(PatientRepository patientRepository){
        this.patientRepository = patientRepository;
    }

    // Para manipulação de patient, chamar service de address para manipulação do address

}

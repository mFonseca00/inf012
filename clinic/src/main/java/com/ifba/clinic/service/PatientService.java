package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.repository.PatientRepository;

@Service
public class PatientService {

    PatientRepository patientRepository;

    PatientService(PatientRepository patientRepository){
        this.patientRepository = patientRepository;
    }

    // Para manipulação de patient, chamar service de address para manipulação do address

}

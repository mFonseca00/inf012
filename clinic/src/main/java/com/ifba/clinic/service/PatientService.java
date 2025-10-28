package com.ifba.clinic.service;

import com.ifba.clinic.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    PatientRepository patientRepository;

    PatientService(PatientRepository patientRepository){
        this.patientRepository = patientRepository;
    }


}

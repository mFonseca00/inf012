package com.ifba.clinic.service;

import com.ifba.clinic.repository.DoctorRepository;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    DoctorRepository doctorRepository;

    DoctorService(DoctorRepository doctorRepository){
        this.doctorRepository = doctorRepository;
    }
}

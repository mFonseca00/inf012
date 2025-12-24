package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AddressService addressService;

    DoctorService(DoctorRepository doctorRepository, AddressService addressService){
        this.doctorRepository = doctorRepository;
        this.addressService = addressService;
    }

    // Para manipulação de doctor, chamar service de address para manipulação do address

}

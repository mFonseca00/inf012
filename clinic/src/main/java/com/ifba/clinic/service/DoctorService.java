package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.doctor.DoctorRegDTO;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Doctor;
import com.ifba.clinic.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AddressService addressService;

    @SuppressWarnings("unused")
    DoctorService(DoctorRepository doctorRepository, AddressService addressService){
        this.doctorRepository = doctorRepository;
        this.addressService = addressService;
    }

    public void register(DoctorRegDTO doctorDTO){
        if (doctorRepository.existsByCrm(doctorDTO.crm())) {
            throw new IllegalArgumentException("CRM já cadastrado");
        }
        Address address = addressService.findAddress(doctorDTO.address());
        if (address == null) {
            address = addressService.register(doctorDTO.address());
        }
        Doctor doctor = new Doctor(
            address,doctorDTO.crm(),
            doctorDTO.email(),
            doctorDTO.name(),
            doctorDTO.phoneNumber(),
            doctorDTO.speciality());
        doctorRepository.save(doctor);
    }

}

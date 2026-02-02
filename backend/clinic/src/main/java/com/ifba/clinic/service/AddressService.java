package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.repository.AddressRepository;
import com.ifba.clinic.repository.DoctorRepository;
import com.ifba.clinic.repository.PatientRepository;
import com.ifba.clinic.util.Formatters;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @SuppressWarnings("unused")
    AddressService(AddressRepository addressRepository, PatientRepository patientRepository, DoctorRepository doctorRepository){
        this.addressRepository = addressRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Address register(AddressDTO newAddress){
        String formattedCEP = Formatters.formatCEP(newAddress.cep());
        Address address = new Address(
            newAddress.street(),
            newAddress.number(),
            newAddress.complement(),
            newAddress.district(),
            newAddress.city(),
            newAddress.state(),
            formattedCEP
        );
        addressRepository.save(address);
        return address;
    }

    public Address findAddress(AddressDTO address){
        String formattedCEP = Formatters.formatCEP(address.cep());
        return addressRepository.findByAddressFields(
                address.street(),
                address.district(),
                address.city(),
                address.state(),
                formattedCEP,
                address.number(),
                address.complement()
        );
    }

    public void deleteAddressIfUnused(Address address) {
        if (!patientRepository.existsByAddress(address) && !doctorRepository.existsByAddress(address)) {
            addressRepository.deleteById(address.getId());
        }
    }
}

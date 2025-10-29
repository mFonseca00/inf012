package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.repository.AddressRepository;

@Service
public class AddressService {

    AddressRepository addressRepository;

    AddressService(AddressRepository addressRepository){
        this.addressRepository = addressRepository;
    }

}

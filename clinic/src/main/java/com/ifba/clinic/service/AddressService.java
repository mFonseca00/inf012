package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.repository.AddressRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    AddressService(AddressRepository addressRepository){
        this.addressRepository = addressRepository;
    }

    public void register(AddressDTO newAddress){
        Address existingAddress = addressRepository.findByAddressFields(
                newAddress.getStreet(),
                newAddress.getDistrict(),
                newAddress.getCity(),
                newAddress.getState(),
                newAddress.getCep(),
                newAddress.getNumber(),
                newAddress.getComplement()
        );
        if (existingAddress != null) {
            throw new IllegalArgumentException("Endereço já cadastrado");
        }
        Address address = new Address(
            newAddress.getStreet(),
            newAddress.getNumber(),
            newAddress.getComplement(),
            newAddress.getDistrict(),
            newAddress.getCity(),
            newAddress.getState(),
            newAddress.getCep()
        );
        addressRepository.save(address);
    }

    public Address findAddress(AddressDTO address){
        return addressRepository.findByAddressFields(
                address.getStreet(),
                address.getDistrict(),
                address.getCity(),
                address.getState(),
                address.getCep(),
                address.getNumber(),
                address.getComplement()
        );
    }
}

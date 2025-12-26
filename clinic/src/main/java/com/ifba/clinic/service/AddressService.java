package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.repository.AddressRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    @SuppressWarnings("unused")
    AddressService(AddressRepository addressRepository){
        this.addressRepository = addressRepository;
    }

    public Address register(AddressDTO newAddress){

        if (this.findAddress(newAddress) != null) {
            throw new IllegalArgumentException("Endereço já cadastrado");
        }
        Address address = new Address(
            newAddress.street(),
            newAddress.number(),
            newAddress.complement(),
            newAddress.district(),
            newAddress.city(),
            newAddress.state(),
            newAddress.cep()
        );
        addressRepository.save(address);
        return address;
    }

    public Address findAddress(AddressDTO address){
        return addressRepository.findByAddressFields(
                address.street(),
                address.district(),
                address.city(),
                address.state(),
                address.cep(),
                address.number(),
                address.complement()
        );
    }

    public void delete(Long addressId) {
        addressRepository.deleteById(addressId);
    }
}

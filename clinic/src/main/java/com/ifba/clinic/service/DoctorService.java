package com.ifba.clinic.service;

import com.ifba.clinic.dto.doctor.DoctorRsponseDTO;
import com.ifba.clinic.dto.doctor.DoctorUpdateDTO;
import com.ifba.clinic.dto.doctor.DoctorinactivationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public void update(DoctorUpdateDTO doctorDTO) {
        Doctor doctor = doctorRepository.findByCrm(doctorDTO.crm());
        if (doctor == null) {
            throw new IllegalArgumentException("Médico não encontrado");
        }
        Address currentAddress = addressService.findAddress(doctorDTO.address());
        Address oldAddress = doctor.getAddress();
        if (currentAddress == null) {
            currentAddress = addressService.register(doctorDTO.address());
        }
        if (!oldAddress.equals(currentAddress)) {
            doctor.setAddress(currentAddress);
        }
        if (!doctor.getName().equals(doctorDTO.name())) {
            doctor.setName(doctorDTO.name());
        }
        if (!doctor.getPhoneNumber().equals(doctorDTO.phoneNumber())) {
            doctor.setPhoneNumber(doctorDTO.phoneNumber());
        }
        doctorRepository.save(doctor);
        if(!doctorRepository.existsByAddress(oldAddress)) {
            // Remover endereço antigo se não estiver mais associado a nenhum médico
            addressService.delete(oldAddress.getId());
        }
    }

    public void delete(DoctorinactivationDTO doctorDTO) {
        Doctor doctor = doctorRepository.findByCrm(doctorDTO.crm());
        if (doctor == null) {
            throw new IllegalArgumentException("Médico não encontrado");
        }
        doctor.setIsActive(false);
        doctorRepository.save(doctor);
    }

    public Page<DoctorRsponseDTO> getAllDoctors(Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.findAll(pageable);
        return doctors.map(doctor -> new DoctorRsponseDTO(
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCrm(),
                doctor.getSpeciality()
        ));
    }

    public DoctorRsponseDTO getDoctor(String crm) {
        Doctor doctor = doctorRepository.findByCrm(crm);
        if (doctor == null) {
            throw new IllegalArgumentException("Médico não encontrado");
        }
        return new DoctorRsponseDTO(
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCrm(),
                doctor.getSpeciality()
        );
    }

}

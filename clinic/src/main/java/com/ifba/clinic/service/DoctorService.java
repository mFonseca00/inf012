package com.ifba.clinic.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.doctor.DoctorInactivationDTO;
import com.ifba.clinic.dto.doctor.DoctorRegDTO;
import com.ifba.clinic.dto.doctor.DoctorResponseDTO;
import com.ifba.clinic.dto.doctor.DoctorUpdateDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.exception.InvalidOperationException;
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
        validateUniqueCRM(doctorDTO.crm());
        validateUniqueEmail(doctorDTO.email());
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
            throw new EntityNotFoundException("Médico de CRM " + doctorDTO.crm() + " não encontrado");
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
            addressService.delete(oldAddress.getId());
        }
    }

    public void inactivate(DoctorInactivationDTO doctorDTO) {
        Doctor doctor = doctorRepository.findByCrm(doctorDTO.crm());
        if (doctor == null) {
            throw new EntityNotFoundException("Médico de CRM " + doctorDTO.crm() + " não encontrado");
        }
        if (!doctor.getIsActive()) {
            throw new InvalidOperationException("Médico de CRM " + doctorDTO.crm() + " já está inativo");
        }
        doctor.setIsActive(false);
        doctorRepository.save(doctor);
    }

    public Page<DoctorResponseDTO> getAllDoctors(Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.findAll(pageable);
        return doctors.map(doctor -> new DoctorResponseDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCrm(),
                doctor.getSpeciality(),
                doctor.getIsActive()
        ));
    }

    public DoctorResponseDTO getDoctor(String crm) {
        String formattedCrm = formatCRM(crm);
        Doctor doctor = doctorRepository.findByCrm(formattedCrm);
        if (doctor == null) {
            throw new EntityNotFoundException("Médico de CRM " + crm + " não encontrado");
        }
        return new DoctorResponseDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getEmail(),
                doctor.getCrm(),
                doctor.getSpeciality(),
                doctor.getIsActive()
        );
    }

    // Helper methods
    private void validateUniqueCRM(String crm) {
        if (doctorRepository.existsByCrm(crm)) {
            throw new BusinessRuleException("CRM " + crm + " já cadastrado");
        }
    }
    private void validateUniqueEmail(String email) {
        if(doctorRepository.existsByEmail(email)) {
            throw new BusinessRuleException("Email " + email + " já cadastrado");
        }
    }
    private String formatCRM(String crm) {
        String cleanCrm = crm.replaceAll("[.\\-\\/\\s]", "");
        if (cleanCrm.length() == 10 && cleanCrm.matches("\\d{8}[A-Z]{2}")) {
            return cleanCrm.substring(0, 6) + "-" +
                    cleanCrm.substring(6, 8) + "/" +
                    cleanCrm.substring(8, 10);
        }
        return crm;
    }
}

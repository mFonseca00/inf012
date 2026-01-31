package com.ifba.clinic.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.patient.PatientInactivationDTO;
import com.ifba.clinic.dto.patient.PatientRegDTO;
import com.ifba.clinic.dto.patient.PatientResponseDTO;
import com.ifba.clinic.dto.patient.PatientUpdateDTO;
import com.ifba.clinic.dto.user.UserFromEntityDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Patient;
import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.PatientRepository;
import com.ifba.clinic.repository.RoleRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final RoleRepository roleRepository;
    private final UserService userService;
    private final AddressService addressService;

    @SuppressWarnings("unused")
    PatientService(PatientRepository patientRepository, AddressService addressService, UserService userService, RoleRepository roleRepository){
        this.patientRepository = patientRepository;
        this.roleRepository = roleRepository;
        this.userService = userService;
        this.addressService = addressService;
    }

    public void register(PatientRegDTO patientDTO){
        validateUniqueCPF(patientDTO.cpf());
        validateEmailRequirement(patientDTO.username(), patientDTO.email());
        UserFromEntityDTO userDTO = new UserFromEntityDTO(
            patientDTO.username(),
            patientDTO.name(),
            patientDTO.email()
        );
        User user = userService.findOrCreateUser(userDTO);
        if (userService.hasPatient(user)) {
            throw new BusinessRuleException("Este usuário já possui um paciente vinculado");
        }
        Role patientRole = roleRepository.findByRole(UserRole.PATIENT.name())
                    .orElseThrow(() -> new EntityNotFoundException("Role PATIENT não encontrada"));
        user.addRole(patientRole);
        Address address =addressService.findAddress(patientDTO.address());
        if (address == null){
            address = addressService.register(patientDTO.address());
        }
        Patient patient = new Patient(
                patientDTO.name(),
                patientDTO.phoneNumber(),
                patientDTO.cpf(),
                address,
                user
        );
        patientRepository.save(patient);
    }

    public void update(PatientUpdateDTO patientDTO) {
        Patient patient = patientRepository.findByCpf(patientDTO.cpf());
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + patientDTO.cpf() + " não encontrado");
        }
        Address currentAddress = addressService.findAddress(patientDTO.address());
        Address oldAddress = patient.getAddress();
        if (currentAddress == null) {
            currentAddress = addressService.register(patientDTO.address());
        }
        if (!oldAddress.equals(currentAddress)) {
            patient.setAddress(currentAddress);
        }
        if (!patient.getName().equals(patientDTO.name())) {
            patient.setName(patientDTO.name());
        }
        if (!patient.getPhoneNumber().equals(patientDTO.phoneNumber())) {
            patient.setPhoneNumber(patientDTO.phoneNumber());
        }
        patientRepository.save(patient);
        if(!patientRepository.existsByAddress(oldAddress)) {
            addressService.delete(oldAddress.getId());
        }
    }

    public void inactivate(PatientInactivationDTO patientDTO) {
        Patient patient = patientRepository.findByCpf(patientDTO.cpf());
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + patientDTO.cpf() + " não encontrado");
        }
        if (!patient.getIsActive()) {
            throw new BusinessRuleException("Paciente de CPF " + patientDTO.cpf() + " já está inativo");
        }
        patient.setIsActive(false);
        patientRepository.save(patient);
    }

    public Page<PatientResponseDTO> getAllPatients(Pageable pageable) {
        Page<Patient> patients = patientRepository.findAll(pageable);
        return patients.map(patient -> new PatientResponseDTO(
            patient.getId(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getCpf(),
            patient.getIsActive()
        ));
    }

    public PatientResponseDTO getPatientByCPF(String cpf) {
        String formattedCpf = formatCPF(cpf);
        Patient patient = patientRepository.findByCpf(formattedCpf);
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + cpf + " não encontrado");
        }
        return new PatientResponseDTO(
            patient.getId(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getCpf(),
            patient.getIsActive()
        );
    }

    // Helper methods
    private void validateEmailRequirement(String username, String email) {
        if ((username == null || username.isBlank()) && (email == null || email.isBlank())) {
            throw new BusinessRuleException("É necessário informar o email ou username do paciente");
        }
    }

    private void validateUniqueCPF(String cpf) {
        if (patientRepository.existsByCpf(cpf)) {
            throw new BusinessRuleException("CPF " + cpf + " já cadastrado");
        }
    }

    private String formatCPF(String cpf) {
        String cleanCpf = cpf.replaceAll("[.\\-\\s]", "");
        if (cleanCpf.length() == 11 && cleanCpf.matches("\\d{11}")) {
            return cleanCpf.substring(0, 3) + "." +
                    cleanCpf.substring(3, 6) + "." +
                    cleanCpf.substring(6, 9) + "-" +
                    cleanCpf.substring(9, 11);
        }
        return cpf;
    }
}

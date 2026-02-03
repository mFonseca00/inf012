package com.ifba.clinic.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.dto.mix.UserPatientRegDTO;
import com.ifba.clinic.dto.patient.PatientDetailDTO;
import com.ifba.clinic.dto.patient.PatientInactivationDTO;
import com.ifba.clinic.dto.patient.PatientRegDTO;
import com.ifba.clinic.dto.patient.PatientResponseDTO;
import com.ifba.clinic.dto.patient.PatientUpdateDTO;
import com.ifba.clinic.dto.user.UserFromEntityDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.exception.InvalidOperationException;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Patient;
import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.PatientRepository;
import com.ifba.clinic.repository.RoleRepository;
import com.ifba.clinic.repository.UserRepository;
import com.ifba.clinic.util.Formatters;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final AddressService addressService;
    private final EmailService emailService;

    @SuppressWarnings("unused")
    PatientService(PatientRepository patientRepository, AddressService addressService, UserService userService, RoleRepository roleRepository, UserRepository userRepository, com.ifba.clinic.service.EmailService emailService){
        this.patientRepository = patientRepository;
        this.roleRepository = roleRepository;
        this.userService = userService;
        this.addressService = addressService;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public void register(PatientRegDTO patientDTO){
        String formattedCPF = Formatters.formatCPF(patientDTO.cpf());
        String formattedPhone = Formatters.formatPhone(patientDTO.phoneNumber());
        validateUniqueCPF(formattedCPF);
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
                formattedPhone,
                formattedCPF,
                address,
                user
        );
        patientRepository.save(patient);
    }

    public void registerWithUserInfo(UserPatientRegDTO regDTO){
        String formattedCPF = Formatters.formatCPF(regDTO.cpf());
        String formattedPhone = Formatters.formatPhone(regDTO.phoneNumber());
        validateUniqueCPF(formattedCPF);
        validateEmailRequirement(regDTO.username(), regDTO.email());
        UserRegDTO userRegDTO = new UserRegDTO(regDTO.username(), regDTO.password(), regDTO.email());
        userService.register(userRegDTO);
        User user = (User) userRepository.findByUsername(regDTO.username());
        Role patientRole = roleRepository.findByRole(UserRole.PATIENT.name())
                    .orElseThrow(() -> new EntityNotFoundException("Role PATIENT não encontrada"));
        user.addRole(patientRole);
        Address address =addressService.findAddress(regDTO.address());
        if (address == null){
            address = addressService.register(regDTO.address());
        }
        Patient patient = new Patient(
                regDTO.fullName(),
                formattedPhone,
                formattedCPF,
                address,
                user
        );
        patientRepository.save(patient);
        emailService.sendUserRegistrationEmail(user.getId(), user.getEmail());
    }

    public void update(PatientUpdateDTO patientDTO) {
        String formattedCPF = Formatters.formatCPF(patientDTO.cpf());
        String formattedPhone = Formatters.formatPhone(patientDTO.phoneNumber());
        Patient patient = patientRepository.findByCpf(formattedCPF);
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
        if (!patient.getPhoneNumber().equals(formattedPhone)) {
            patient.setPhoneNumber(formattedPhone);
        }
        patientRepository.save(patient);
        addressService.deleteAddressIfUnused(oldAddress);
    }

    public void inactivate(PatientInactivationDTO patientDTO) {
        String formattedCPF = Formatters.formatCPF(patientDTO.cpf());
        Patient patient = patientRepository.findByCpf(formattedCPF);
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + patientDTO.cpf() + " não encontrado");
        }
        if (!patient.getIsActive()) {
            throw new InvalidOperationException("Paciente de CPF " + patientDTO.cpf() + " já está inativo");
        }
        patient.setIsActive(false);
        patientRepository.save(patient);
    }

    public void reactivate(PatientInactivationDTO patientDTO) {
        String formattedCPF = Formatters.formatCPF(patientDTO.cpf());
        Patient patient = patientRepository.findByCpf(formattedCPF);
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + patientDTO.cpf() + " não encontrado");
        }
        if (patient.getIsActive()) {
            throw new InvalidOperationException("Paciente de CPF " + patientDTO.cpf() + " já está ativo");
        }
        patient.setIsActive(true);
        patientRepository.save(patient);
    }

    public Page<PatientResponseDTO> getAllPatients(Pageable pageable) {
        Page<Patient> patients = patientRepository.findAll(pageable);
        return patients.map(patient -> new PatientResponseDTO(
            patient.getId(),
            patient.getCpf(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getIsActive()
        ));
    }

    public Page<PatientResponseDTO> getPatientsByName(String name, Pageable pageable) {
        Page<Patient> patients = patientRepository.findByNameContainingIgnoreCase(name, pageable);
        return patients.map(patient -> new PatientResponseDTO(
            patient.getId(),
            patient.getCpf(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getIsActive()
        ));
    }

    public PatientResponseDTO getPatientByCPF(String cpf) {
        String formattedCpf = Formatters.formatCPF(cpf);
        Patient patient = patientRepository.findByCpf(formattedCpf);
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + cpf + " não encontrado");
        }
        return new PatientResponseDTO(
            patient.getId(),
            patient.getCpf(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getIsActive()
        );
    }

    public PatientResponseDTO getPatient(String username) {
        Patient patient = getPatientByUsername(username);
        return new PatientResponseDTO(
            patient.getId(),
            patient.getCpf(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getIsActive()
        );
    }

    public PatientDetailDTO getPatientInfo(String username) {
        User user = (User) userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        
        Patient patient = patientRepository.findByUserId(user.getId());
        if (patient == null) {
            throw new EntityNotFoundException("Paciente não encontrado para este usuário");
        }
        
        AddressDTO addressDTO = new AddressDTO(
            patient.getAddress().getStreet(),
            patient.getAddress().getNumber(),
            patient.getAddress().getComplement(),
            patient.getAddress().getDistrict(),
            patient.getAddress().getCity(),
            patient.getAddress().getState(),
            patient.getAddress().getCep()
        );
        
        return new PatientDetailDTO(
            patient.getId(),
            patient.getName(),
            user.getEmail(),
            user.getUsername(),
            patient.getPhoneNumber(),
            patient.getCpf(),
            addressDTO,
            patient.getIsActive()
        );
    }

    public PatientDetailDTO getPatientInfoByCpf(String cpf) {
        String formattedCpf = Formatters.formatCPF(cpf);
        Patient patient = patientRepository.findByCpf(formattedCpf);
        if (patient == null) {
            throw new EntityNotFoundException("Paciente de CPF " + cpf + " não encontrado");
        }
        
        AddressDTO addressDTO = new AddressDTO(
            patient.getAddress().getStreet(),
            patient.getAddress().getNumber(),
            patient.getAddress().getComplement(),
            patient.getAddress().getDistrict(),
            patient.getAddress().getCity(),
            patient.getAddress().getState(),
            patient.getAddress().getCep()
        );
        
        return new PatientDetailDTO(
            patient.getId(),
            patient.getName(),
            patient.getUser().getEmail(),
            patient.getUser().getUsername(),
            patient.getPhoneNumber(),
            patient.getCpf(),
            addressDTO,
            patient.getIsActive()
        );
    }

    public Patient getPatientByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if(user==null){
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        Patient patient = patientRepository.findByUserId(user.getId());
        if (patient == null) {
            throw new EntityNotFoundException("Paciente não encontrado para este usuário");
        }
        return patient;
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

}

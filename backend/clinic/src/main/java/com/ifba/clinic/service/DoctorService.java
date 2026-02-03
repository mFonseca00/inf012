package com.ifba.clinic.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.address.AddressDTO;
import com.ifba.clinic.dto.doctor.DoctorDetailDTO;
import com.ifba.clinic.dto.doctor.DoctorInactivationDTO;
import com.ifba.clinic.dto.doctor.DoctorRegDTO;
import com.ifba.clinic.dto.doctor.DoctorResponseDTO;
import com.ifba.clinic.dto.doctor.DoctorUpdateDTO;
import com.ifba.clinic.dto.user.UserFromEntityDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.exception.InvalidOperationException;
import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Doctor;
import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.DoctorRepository;
import com.ifba.clinic.repository.RoleRepository;
import com.ifba.clinic.repository.UserRepository;
import com.ifba.clinic.util.Formatters;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final AddressService addressService;

    @SuppressWarnings("unused")
    DoctorService(DoctorRepository doctorRepository, AddressService addressService, UserRepository userRepository, UserService userService, RoleRepository roleRepository){
        this.doctorRepository = doctorRepository;
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.addressService = addressService;
    }

    public void register(DoctorRegDTO doctorDTO){
        String formattedCRM = Formatters.formatCRM(doctorDTO.crm());
        String formattedPhone = Formatters.formatPhone(doctorDTO.phoneNumber());
        validateUniqueCRM(formattedCRM);
        validateEmailRequirement(doctorDTO.username(), doctorDTO.email());
        UserFromEntityDTO userDTO = new UserFromEntityDTO(
            doctorDTO.username(),
            doctorDTO.name(),
            doctorDTO.email()
        );
        User user = userService.findOrCreateUser(userDTO);
        if (userService.hasDoctor(user)) {
            throw new BusinessRuleException("Este usuário já possui um médico vinculado");
        }
        Role doctorRole = roleRepository.findByRole(UserRole.DOCTOR.name())
                    .orElseThrow(() -> new EntityNotFoundException("Role DOCTOR não encontrada"));
        user.addRole(doctorRole);
        Address address = addressService.findAddress(doctorDTO.address());
        if (address == null) {
            address = addressService.register(doctorDTO.address());
        }
        Doctor doctor = new Doctor(
                address,
                formattedCRM,
                doctorDTO.name(),
                formattedPhone,
                doctorDTO.speciality(),
                user
        );
        doctorRepository.save(doctor);
    }

    public void update(DoctorUpdateDTO doctorDTO) {
        String formattedCRM = Formatters.formatCRM(doctorDTO.crm());
        String formattedPhone = Formatters.formatPhone(doctorDTO.phoneNumber());
        Doctor doctor = doctorRepository.findByCrm(formattedCRM);
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
        if (!doctor.getPhoneNumber().equals(formattedPhone)) {
            doctor.setPhoneNumber(formattedPhone);
        }
        doctorRepository.save(doctor);
        addressService.deleteAddressIfUnused(oldAddress);
    }

    public void inactivate(DoctorInactivationDTO doctorDTO) {
        String formattedCRM = Formatters.formatCRM(doctorDTO.crm());
        Doctor doctor = doctorRepository.findByCrm(formattedCRM);
        if (doctor == null) {
            throw new EntityNotFoundException("Médico de CRM " + doctorDTO.crm() + " não encontrado");
        }
        if (!doctor.getIsActive()) {
            throw new InvalidOperationException("Médico de CRM " + doctorDTO.crm() + " já está inativo");
        }
        doctor.setIsActive(false);
        doctorRepository.save(doctor);
    }

    public void reactivate(DoctorInactivationDTO doctorDTO) {
        String formattedCRM = Formatters.formatCRM(doctorDTO.crm());
        Doctor doctor = doctorRepository.findByCrm(formattedCRM);
        if (doctor == null) {
            throw new EntityNotFoundException("Médico de CRM " + doctorDTO.crm() + " não encontrado");
        }
        if (doctor.getIsActive()) {
            throw new InvalidOperationException("Médico de CRM " + doctorDTO.crm() + " já está ativo");
        }
        doctor.setIsActive(true);
        doctorRepository.save(doctor);
    }

    public Page<DoctorResponseDTO> getAllDoctors(Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.findAll(pageable);
        return doctors.map(doctor -> new DoctorResponseDTO(
                doctor.getId(),
                doctor.getCrm(),
                doctor.getName(),
                doctor.getUser().getEmail(),
                doctor.getSpeciality(),
                doctor.getIsActive()
        ));
    }

    public Page<DoctorResponseDTO> getDoctorsByName(String name, Pageable pageable) {
        Page<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCase(name, pageable);
        return doctors.map(doctor -> new DoctorResponseDTO(
                doctor.getId(),
                doctor.getCrm(),
                doctor.getName(),
                doctor.getUser().getEmail(),
                doctor.getSpeciality(),
                doctor.getIsActive()
        ));
    }

    public DoctorResponseDTO getDoctor(String crm) {
        String formattedCrm = Formatters.formatCRM(crm);
        Doctor doctor = doctorRepository.findByCrm(formattedCrm);
        if (doctor == null) {
            throw new EntityNotFoundException("Médico de CRM " + crm + " não encontrado");
        }
        return new DoctorResponseDTO(
                doctor.getId(),
                doctor.getCrm(),
                doctor.getName(),
                doctor.getUser().getEmail(),
                doctor.getSpeciality(),
                doctor.getIsActive()
        );
    }

    public Doctor getDoctorByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if(user==null){
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        Doctor doctor = doctorRepository.findByUserId(user.getId());
        if (doctor == null) {
            return null;
        }
        return doctor;
    }

    public DoctorDetailDTO getDoctorInfo(String crm) {
        String formattedCrm = Formatters.formatCRM(crm);
        Doctor doctor = doctorRepository.findByCrm(formattedCrm);
        if (doctor == null) {
            throw new EntityNotFoundException("Médico de CRM " + crm + " não encontrado");
        }
        
        AddressDTO addressDTO = new AddressDTO(
            doctor.getAddress().getStreet(),
            doctor.getAddress().getNumber(),
            doctor.getAddress().getComplement(),
            doctor.getAddress().getDistrict(),
            doctor.getAddress().getCity(),
            doctor.getAddress().getState(),
            doctor.getAddress().getCep()
        );
        
        return new DoctorDetailDTO(
            doctor.getId(),
            doctor.getCrm(),
            doctor.getName(),
            doctor.getUser().getEmail(),
            doctor.getUser().getUsername(),
            doctor.getPhoneNumber(),
            doctor.getSpeciality(),
            addressDTO,
            doctor.getIsActive()
        );
    }

    public DoctorDetailDTO getDoctorInfoByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        
        Doctor doctor = doctorRepository.findByUserId(user.getId());
        if (doctor == null) {
            throw new EntityNotFoundException("Médico não encontrado para este usuário");
        }
        
        AddressDTO addressDTO = new AddressDTO(
            doctor.getAddress().getStreet(),
            doctor.getAddress().getNumber(),
            doctor.getAddress().getComplement(),
            doctor.getAddress().getDistrict(),
            doctor.getAddress().getCity(),
            doctor.getAddress().getState(),
            doctor.getAddress().getCep()
        );
        
        return new DoctorDetailDTO(
            doctor.getId(),
            doctor.getCrm(),
            doctor.getName(),
            doctor.getUser().getEmail(),
            doctor.getUser().getUsername(),
            doctor.getPhoneNumber(),
            doctor.getSpeciality(),
            addressDTO,
            doctor.getIsActive()
        );
    }

    // Helper methods
    private void validateEmailRequirement(String username, String email) {
        if ((username == null || username.isBlank()) && (email == null || email.isBlank())) {
            throw new BusinessRuleException("É necessário informar o email ou username do médico");
        }
    }

    private void validateUniqueCRM(String crm) {
        if (doctorRepository.existsByCrm(crm)) {
            throw new BusinessRuleException("CRM " + crm + " já cadastrado");
        }
    }
}

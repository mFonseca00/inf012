package com.ifba.clinic.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.user.ChangePasswordDTO;
import com.ifba.clinic.dto.user.ChangeRoleDTO;
import com.ifba.clinic.dto.user.LoginDTO;
import com.ifba.clinic.dto.user.UserBasicInfoDTO;
import com.ifba.clinic.dto.user.UserDataUpdateDTO;
import com.ifba.clinic.dto.user.UserFromEntityDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.dto.user.UserResponseDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.exception.InvalidOperationException;
import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.DoctorRepository;
import com.ifba.clinic.repository.PatientRepository;
import com.ifba.clinic.repository.RoleRepository;
import com.ifba.clinic.repository.UserRepository;

@Service
public class UserService {

    private final AuthenticationManager authenticationManager;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;
    private final EmailService emailService;

    public UserService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, TokenService tokenService, EmailService emailService, PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.authenticationManager = authenticationManager;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenService = tokenService;
        this.emailService = emailService;
    }

    public String login(LoginDTO login) {
        var usernamePassToken = new UsernamePasswordAuthenticationToken(login.username(), login.password());
        var auth = authenticationManager.authenticate(usernamePassToken);
        return tokenService.generateToken((User) auth.getPrincipal());
    }

    public void register(UserRegDTO newUser) {
        validateUniqueUsername(newUser.username());
        validateUniqueEmail(newUser.email());
        String encodedPassword = new BCryptPasswordEncoder().encode(newUser.password());
        Role defaultRole = roleRepository.findByRole(UserRole.USER.name())
                .orElseThrow(() -> new EntityNotFoundException("Role USER não encontrada"));
        User user = new User(newUser.username(), newUser.email(), encodedPassword, defaultRole);
        userRepository.save(user);
        emailService.sendUserRegistrationEmail(user.getId(),user.getEmail());
    }

    public void addRole(ChangeRoleDTO dto) {
        Role newRole = roleRepository.findByRole(dto.role())
                .orElseThrow(() -> new EntityNotFoundException("Role " + dto.role() + " não encontrada"));
        User user = findUserByUsername(dto.username());

        if (user.getRoles().contains(newRole)) {
            throw new BusinessRuleException("Usuário já possui a role " + dto.role());
        }

        user.addRole(newRole);
        userRepository.save(user);
    }

    public void removeRole(ChangeRoleDTO dto) {
        Role roleToRemove = roleRepository.findByRole(dto.role())
                .orElseThrow(() -> new EntityNotFoundException("Role " + dto.role() + " não encontrada"));
        User user = findUserByUsername(dto.username());

        if (roleToRemove.getAuthority().equals(UserRole.MASTER.name())) {
            throw new BusinessRuleException("Não é possível remover a role MASTER");
        }
        if (roleToRemove.getAuthority().equals(UserRole.USER.name())) {
            throw new BusinessRuleException("Não é possível remover a role USER padrão");
        }
        if (!user.getRoles().contains(roleToRemove)) {
            throw new BusinessRuleException("Usuário não possui a role " + dto.role());
        }

        user.removeRole(roleToRemove);
        userRepository.save(user);
    }

    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(user -> new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                user.getRoles().stream().map(Role::getAuthority).toList()
        ));
    }

    public void deactivateUser(UserBasicInfoDTO userDTO) {
        User user = findUserByUsername(userDTO.username());

        if (!user.getIsActive()) {
            throw new InvalidOperationException("Usuário " + userDTO.username() + " já está desativado");
        }

        user.setIsActive(false);
        user.setDeactivatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void activateUser(UserBasicInfoDTO userDTO) {
        User user = findUserByUsername(userDTO.username());

        if (user.getIsActive()) {
            throw new InvalidOperationException("Usuário " + userDTO.username() + " já está ativo");
        }

        user.setIsActive(true);
        user.setDeactivatedAt(null);
        userRepository.save(user);
    }

    public UserResponseDTO getUser(String username) {
        User user = findUserByUsername(username);
        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.isEnabled(),
                user.getRoles().stream().map(Role::getAuthority).toList()
        );
    }

    public void update(UserDataUpdateDTO dto){
        User user = findUserByUsername(dto.username());
        if (dto.email() != null && !dto.email().isBlank()) {
            validateUniqueEmail(dto.email());
            user.setEmail(dto.email());
        }
        if (dto.password() != null && !dto.password().isBlank()) {
            String encoded = new BCryptPasswordEncoder().encode(dto.password());
            user.setPassword(encoded);
        }
        if (dto.roles() != null && !dto.roles().isEmpty()) {
            var resolvedRoles = dto.roles().stream()
                    .map(r -> roleRepository.findByRole(r.getAuthority())
                            .orElseThrow(() -> new EntityNotFoundException("Role " + r.getAuthority() + " não encontrada")))
                    .toList();
            user.getRoles().clear();
            user.getRoles().addAll(new java.util.HashSet<>(resolvedRoles));
        }
        userRepository.save(user);
    }

    public void changePassword(String username, ChangePasswordDTO passwordDTO) {
        User user = findUserByUsername(username);
        String encodedPassword = new BCryptPasswordEncoder().encode(passwordDTO.newPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        emailService.sendPasswordChangeConfirmationEmail(user.getId(), user.getEmail());
    }

    public User findOrCreateUser(UserFromEntityDTO userDTO) {
        if (userDTO.username() == null || userDTO.username().isBlank()) {
            String username = generateUsernameFromName(userDTO.name());
            validateUniqueEmail(userDTO.email());
            String tempPassword = new BCryptPasswordEncoder().encode("temp123");
            Role defaultRole = roleRepository.findByRole(UserRole.USER.name())
                    .orElseThrow(() -> new EntityNotFoundException("Role USER não encontrada"));
            User newUser = new User(username, userDTO.email(), tempPassword, defaultRole);
            emailService.sendUserAutoRegistrationEmail(newUser.getId(),newUser.getEmail(), newUser.getUsername());
            return userRepository.save(newUser);
        }
        User user = (User) userRepository.findByUsername(userDTO.username());
        if (user == null) {
            throw new EntityNotFoundException("Usuário " + userDTO.username() + " não encontrado");
        }
        return user;
    }

    public List<String> getUserRoles(String username) {
        User user = findUserByUsername(username);
        return user.getRoles().stream()
            .map(Role::getRole)
            .collect(Collectors.toList());
    }

    // Helper methods
    private String generateUsernameFromName(String name) {
        String baseName = (name == null || name.isBlank()) ? "user" : name;
        // Remove acentos e caracteres especiais
        String normalized = java.text.Normalizer.normalize(baseName, java.text.Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "");
        // Converte para lowercase e remove espaços
        String username = normalized.toLowerCase()
                .replaceAll("\\s+", ".")
                .replaceAll("[^a-z0-9.]", "");
        // Limita o tamanho
        if (username.length() > 20) {
            username = username.substring(0, 20);
        }
        return ensureUniqueUsername(username);
    }

    private String ensureUniqueUsername(String baseUsername) {
        String username = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        return username;
    }
    private User findUserByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("Usuário " + username + " não encontrado");
        }
        return user;
    }

    private void validateUniqueUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new BusinessRuleException("Username " + username + " já está em uso");
        }
    }

    private void validateUniqueEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleException("Email " + email + " já está cadastrado");
        }
    }

    public boolean hasPatient(User user) {
        return patientRepository.existsByUser(user);
    }

    public boolean hasDoctor(User user) {
        return doctorRepository.existsByUser(user);
    }

}
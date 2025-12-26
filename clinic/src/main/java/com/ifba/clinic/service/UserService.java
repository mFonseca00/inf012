package com.ifba.clinic.service;

import java.time.LocalDateTime;

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
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.dto.user.UserResponseDTO;
import com.ifba.clinic.exception.BusinessRuleException;
import com.ifba.clinic.exception.EntityNotFoundException;
import com.ifba.clinic.exception.InvalidOperationException;
import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.RoleRepository;
import com.ifba.clinic.repository.UserRepository;

@Service
public class UserService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenService tokenService;

    public UserService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenService = tokenService;
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
                .orElseThrow(() -> new EntityNotFoundException("Role USER not found"));
        User user = new User(newUser.username(), newUser.email(), encodedPassword, defaultRole);
        userRepository.save(user);
    }

    public void addRole(ChangeRoleDTO dto) {
        Role newRole = roleRepository.findByRole(dto.role())
                .orElseThrow(() -> new EntityNotFoundException("Role " + dto.role() + " not found"));
        User user = findUserByUsername(dto.username());

        if (user.getRoles().contains(newRole)) {
            throw new BusinessRuleException("User already has role " + dto.role());
        }

        user.addRole(newRole);
        userRepository.save(user);
    }

    public void removeRole(ChangeRoleDTO dto) {
        Role roleToRemove = roleRepository.findByRole(dto.role())
                .orElseThrow(() -> new EntityNotFoundException("Role " + dto.role() + " not found"));
        User user = findUserByUsername(dto.username());

        if (roleToRemove.getAuthority().equals(UserRole.MASTER.name())) {
            throw new BusinessRuleException("Cannot remove MASTER role");
        }
        if (roleToRemove.getAuthority().equals(UserRole.USER.name())) {
            throw new BusinessRuleException("Cannot remove default USER role");
        }
        if (!user.getRoles().contains(roleToRemove)) {
            throw new BusinessRuleException("User does not have role " + dto.role());
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
            throw new InvalidOperationException("User " + userDTO.username() + " is already deactivated");
        }

        user.setIsActive(false);
        user.setDeactivatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void activateUser(UserBasicInfoDTO userDTO) {
        User user = findUserByUsername(userDTO.username());

        if (user.getIsActive()) {
            throw new InvalidOperationException("User " + userDTO.username() + " is already active");
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
                            .orElseThrow(() -> new EntityNotFoundException("Role " + r.getAuthority() + " not found")))
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
    }

    // Helper methods
    private User findUserByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User " + username + " not found");
        }
        return user;
    }

    private void validateUniqueUsername(String username) {
        if (userRepository.existsByUsername(username)) {
            throw new BusinessRuleException("Username " + username + " is already taken");
        }
    }

    private void validateUniqueEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessRuleException("Email " + email + " is already registered");
        }
    }

}
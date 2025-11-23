package com.ifba.clinic.service;

import com.ifba.clinic.dto.user.*;
import com.ifba.clinic.exception.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.RoleRepository;
import com.ifba.clinic.repository.UserRepository;

import java.time.LocalDateTime;

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

        if (roleToRemove.getRole().equals(UserRole.MASTER.name())) {
            throw new BusinessRuleException("Cannot remove MASTER role");
        }
        if (roleToRemove.getRole().equals(UserRole.USER.name())) {
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
                user.getRoles().stream().map(Role::getRole).toList()
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

    // Helper methods
    private User findUserByUsername(String username) {
        User user = (User) userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User " + username + " not found");
        }
        return user;
    }
}
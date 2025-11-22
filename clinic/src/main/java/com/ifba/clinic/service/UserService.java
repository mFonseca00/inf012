package com.ifba.clinic.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.user.ChangeRoleDTO;
import com.ifba.clinic.dto.user.LoginDTO;
import com.ifba.clinic.dto.user.TokenDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.dto.user.UserResponseDTO;
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

    public ResponseEntity<TokenDTO> login(LoginDTO login) {
        var usernamePassToken = new UsernamePasswordAuthenticationToken(login.username(), login.password());
        var auth = authenticationManager.authenticate(usernamePassToken);
        var token = tokenService.generateToken((User) auth.getPrincipal());
        return ResponseEntity.ok(new TokenDTO(token));
    }

    public ResponseEntity<String> register(UserRegDTO newUser) {
        String encodedPassword = new BCryptPasswordEncoder().encode(newUser.password());
        Role defaultRole = roleRepository.findByRole(UserRole.USER.name())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        User user = new User(newUser.username(), newUser.email(), encodedPassword, defaultRole);
        this.userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    public ResponseEntity<String> addRole(ChangeRoleDTO dto) {
        Role newRole = roleRepository.findByRole(dto.role())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        User user = (User) userRepository.findByUsername(dto.username());
        if( user.getRoles().contains(newRole)){
            return ResponseEntity.badRequest().body("User already has this role");
        }
        user.addRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok("User role updated successfully");
    }

    public ResponseEntity<String> removeRole(ChangeRoleDTO dto) {
        Role roleToRemove = roleRepository.findByRole(dto.role())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        User user = (User) userRepository.findByUsername(dto.username());
        if (roleToRemove.getRole().equals(UserRole.MASTER.name())) {
            return ResponseEntity.badRequest().body("Cannot remove MASTER role");
        }
        if (roleToRemove.getRole().equals(UserRole.USER.name())) {
            return ResponseEntity.badRequest().body("Cannot remove default USER role");
        }
        if( !user.getRoles().contains(roleToRemove)){
            return ResponseEntity.badRequest().body("User does not have this role");
        }
        user.removeRole(roleToRemove);
        userRepository.save(user);
        return ResponseEntity.ok("User role updated successfully");
    }

    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        Page<UserResponseDTO> response = users.map(user -> new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRoles().stream().map(Role::getRole).toList()
        ));
        return ResponseEntity.ok(response);
    }
}

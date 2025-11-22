package com.ifba.clinic.service;

import com.ifba.clinic.dto.user.ChangeRoleDTO;
import com.ifba.clinic.dto.user.LoginDTO;
import com.ifba.clinic.dto.user.TokenDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.model.entity.Role;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.model.enums.UserRole;
import com.ifba.clinic.repository.RoleRepository;
import com.ifba.clinic.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private TokenService tokenService;

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
        Role defaultRole = roleRepository.findByRole(UserRole.USER)
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
        if( roleToRemove.getRole() == UserRole.USER){
            return ResponseEntity.badRequest().body("Cannot remove default USER role");
        }
        if( !user.getRoles().contains(roleToRemove)){
            return ResponseEntity.badRequest().body("User does not have this role");
        }
        user.removeRole(roleToRemove);
        userRepository.save(user);
        return ResponseEntity.ok("User role updated successfully");
    }
}

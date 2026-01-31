package com.ifba.clinic.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.user.AuthResponseDTO;
import com.ifba.clinic.dto.user.LoginDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação",description = "Endpoints para autenticação e registro de usuários")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginDTO login) {
        String token = userService.login(login);
        List<String> roles = userService.getUserRoles(login.username());
        return ResponseEntity.ok(new AuthResponseDTO(token, roles));
    }

    @PostMapping("/register")
    @Operation(summary = "Registro de usuário", description = "Registra um novo usuário no sistema.")
    public ResponseEntity<String> register(@RequestBody @Valid UserRegDTO newUser) {
        userService.register(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

}

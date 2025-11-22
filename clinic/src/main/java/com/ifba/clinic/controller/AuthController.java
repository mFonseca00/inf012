package com.ifba.clinic.controller;

import com.ifba.clinic.dto.user.LoginDTO;
import com.ifba.clinic.dto.user.TokenDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação",description = "Endpoints para autenticação e registro de usuários")
public class AuthController {

    private UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login",description = "Autentica um usuário e retorna um token JWT.")
    public ResponseEntity<TokenDTO> login(@RequestBody @Valid LoginDTO login) {
        return userService.login(login);
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar novo usuário",description = "Registra um novo usuário com a role padrão USER.")
    public ResponseEntity<String> login(@RequestBody @Valid UserRegDTO newUser) {
        return userService.register(newUser);
    }

}

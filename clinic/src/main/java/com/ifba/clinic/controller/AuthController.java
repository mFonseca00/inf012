package com.ifba.clinic.controller;

import com.ifba.clinic.dto.user.ChangeRoleDTO;
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
@Tag(name = "Autenticação",description = "Endpoints para autenticação e gerenciamento de usuários")
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

    @PatchMapping("/role/add")
    @Operation(summary = "Adicionar role a um usuário",description = "Adiciona uma role específica a um usuário existente. Requer privilégios de ADMIN.")
    public ResponseEntity<String> addRole(@RequestBody @Valid ChangeRoleDTO dto) {
        return userService.addRole(dto);
    }

    @PatchMapping("/role/remove")
    @Operation(summary = "Remover role de um usuário",description = "Remove uma role específica de um usuário existente. Requer privilégios de ADMIN.")
    public ResponseEntity<String> removeRole(@RequestBody @Valid ChangeRoleDTO dto) {
        return userService.removeRole(dto);
    }


}

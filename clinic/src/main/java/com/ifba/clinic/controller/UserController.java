package com.ifba.clinic.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.user.ChangeRoleDTO;
import com.ifba.clinic.dto.user.UserResponseDTO;
import com.ifba.clinic.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
@Tag(name = "Usuários",description = "Endpoints para gerenciamento de usuários")
public class UserController {

    UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    @GetMapping("/all")
    @Operation(summary = "Listar todos os usuários",description = "Retorna uma lista de todos os usuários cadastrados. Requer privilégios de ADMIN.")
    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(
            @PageableDefault(size = 10, sort = "name") Pageable pageable){
        return userService.getAllUsers(pageable);
    }
}

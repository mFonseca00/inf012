package com.ifba.clinic.controller;

import com.ifba.clinic.dto.user.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ifba.clinic.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
@Tag(name = "Usuários",description = "Endpoints para gerenciamento de usuários")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/add-role")
    @Operation(summary = "Adicionar papel ao usuário", description = "Adiciona um papel (role) a um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> addRole(@RequestBody @Valid ChangeRoleDTO dto) {
        userService.addRole(dto);
        return ResponseEntity.ok("Role added successfully");
    }

    @PatchMapping("/remove-role")
    @Operation(summary = "Remover papel do usuário", description = "Remove um papel (role) de um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> removeRole(@RequestBody @Valid ChangeRoleDTO dto) {
        userService.removeRole(dto);
        return ResponseEntity.ok("Role removed successfully");
    }

    @GetMapping("/all")
    @Operation(summary = "Listar todos os usuários", description = "Retorna uma lista paginada de todos os usuários. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<Page<UserResponseDTO>> getAllUsers(Pageable pageable) {
        Page<UserResponseDTO> users = userService.getAllUsers(pageable);
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/deactivate")
    @Operation(summary = "Desativar usuário", description = "Desativa um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> deactivateUser(@RequestBody @Valid UserBasicInfoDTO userDTO) {
        userService.deactivateUser(userDTO);
        return ResponseEntity.ok("User deactivated successfully");
    }

    @PatchMapping("/activate")
    @Operation(summary = "Ativar usuário", description = "Ativa um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> activateUser(@RequestBody @Valid UserBasicInfoDTO userDTO) {
        userService.activateUser(userDTO);
        return ResponseEntity.ok("User activated successfully");
    }
}
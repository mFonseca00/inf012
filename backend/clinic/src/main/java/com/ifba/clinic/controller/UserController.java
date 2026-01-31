package com.ifba.clinic.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.user.ChangePasswordDTO;
import com.ifba.clinic.dto.user.ChangeRoleDTO;
import com.ifba.clinic.dto.user.UserBasicInfoDTO;
import com.ifba.clinic.dto.user.UserDataUpdateDTO;
import com.ifba.clinic.dto.user.UserResponseDTO;
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
        return ResponseEntity.status(HttpStatus.CREATED).body("Role adicionada com sucesso");
    }

    @PatchMapping("/remove-role")
    @Operation(summary = "Remover papel do usuário", description = "Remove um papel (role) de um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> removeRole(@RequestBody @Valid ChangeRoleDTO dto) {
        userService.removeRole(dto);
        return ResponseEntity.ok("Role removida com sucesso");
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

    @GetMapping("/{username}")
    @Operation(summary = "Obter dados de um usuário com base no username", description =  "Retorna os dados do usuário com base em um username. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable String username) {
        UserResponseDTO user = userService.getUser(username);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/deactivate")
    @Operation(summary = "Desativar usuário", description = "Desativa um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> deactivateUser(@RequestBody @Valid UserBasicInfoDTO userDTO) {
        userService.deactivateUser(userDTO);
        return ResponseEntity.ok("Usuário desativado com sucesso");
    }

    @PatchMapping("/activate")
    @Operation(summary = "Ativar usuário", description = "Ativa um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> activateUser(@RequestBody @Valid UserBasicInfoDTO userDTO) {
        userService.activateUser(userDTO);
        return ResponseEntity.ok("Usuário ativado com sucesso");
    }

    @PatchMapping("/update")
    @Operation(summary = "Atualizar dados do usuário", description = "Atualiza os dados de um usuário existente. Requer privilégios de ADMIN ou MASTER.")
    public ResponseEntity<String> updateUser(@RequestBody @Valid UserDataUpdateDTO userDTO){
        userService.update(userDTO);
        return ResponseEntity.ok("Usuário atualizado com sucesso");
    }

    @PatchMapping("/change-password")
    @Operation(summary = "Alterar senha do usuário", description = "Altera a senha de um usuário existente. Requer login do usuário.")
    public ResponseEntity<String> changePassword(@RequestBody @Valid ChangePasswordDTO passwordDTO, Authentication auth){ // Authenticação injetada pelo Spring Security
        userService.changePassword(auth.getName(), passwordDTO);
        return ResponseEntity.ok("Senha alterada com sucesso");
    }
}
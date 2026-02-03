package com.ifba.clinic.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @Operation(summary = "Login de usuário", description = "Autentica um usuário.")
    // MUDANÇA 1: Alterado para Object ou Map, já que não vamos retornar o TokenDTO
    public ResponseEntity<Object> login(@RequestBody @Valid LoginDTO login) {
        String token = userService.login(login);
        
        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false)// [ATENÇÃO]: Use 'false' se estiver rodando em localhost (HTTP). 
                              // Se colocar 'true' aqui e testar sem HTTPS, o navegador IGNORA o cookie.
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();
        
        // MUDANÇA 2: Retornando um objeto JSON simples
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(java.util.Map.of("message", "Login realizado com sucesso"));
    }

    @PostMapping("/register")
    @Operation(summary = "Registro de usuário", description = "Registra um novo usuário no sistema.")
    public ResponseEntity<String> register(@RequestBody @Valid UserRegDTO newUser) {
        userService.register(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Remove o cookie de acesso.")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("accessToken", "") // O valor pode ser vazio
                .httpOnly(true)
                .secure(false)        // Deve ser igual ao do login (false local, true prod)
                .path("/")            // Deve ser igual ao do login
                .maxAge(0)            // <--- O SEGREDO: 0 segundos de vida
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logout realizado com sucesso");
    }

    // AuthController.java

//     @GetMapping("/me")
//     @Operation(summary = "Obter usuário atual", description = "Retorna os dados do usuário logado baseado no cookie.")
//     public ResponseEntity<UserResponseDTO> getCurrentUser() { // Use o DTO de resposta do seu usuário
//         // 1. Recupera o usuário do contexto de segurança (que o SecurityFilter já preencheu)
//         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//         if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
//             UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
//             // 2. Busca os dados completos no serviço se necessário, ou monta o DTO direto
//             UserResponseDTO userDTO = userService.findUserDTOByUsername(userDetails.getUsername()); 
            
//             return ResponseEntity.ok(userDTO);
//         }
        
//         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
// }

}

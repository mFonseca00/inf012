package com.ifba.clinic.controller;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.user.LoginDTO;
import com.ifba.clinic.dto.user.UserRegDTO;
import com.ifba.clinic.dto.user.UserResponseDTO;
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
    public ResponseEntity<Object> login(@RequestBody @Valid LoginDTO login) {
        String token = userService.login(login);
        
        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Strict")
                .build();
        
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
        ResponseCookie cookie = ResponseCookie.from("accessToken", "") 
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logout realizado com sucesso");
    }

    @GetMapping("/session")
    @Operation(summary = "Obter usuário atual", description = "Retorna os dados do usuário logado baseado no cookie.")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            var userEntity = userService.findUserDTOByUsername(userDetails.getUsername()); 
            
            List<String> roles = userEntity.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .toList();

            UserResponseDTO userDTO = new UserResponseDTO(
                userEntity.getId(),
                userEntity.getUsername(),
                userEntity.getEmail(),
                userEntity.isEnabled(),
                roles
            );
            
            return ResponseEntity.ok(userDTO);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

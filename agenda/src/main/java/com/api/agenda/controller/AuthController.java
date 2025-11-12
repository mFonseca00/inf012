package com.api.agenda.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.agenda.dto.LoginDTO;
import com.api.agenda.dto.TokenDTO;
import com.api.agenda.dto.UserDTO;
import com.api.agenda.model.entity.User;
import com.api.agenda.service.JWTService;
import com.api.agenda.service.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private AuthenticationManager manager;
    private UserService userService;
    private JWTService jwtService;

    public AuthController(AuthenticationManager manager, UserService userService, JWTService jwtService) {
        this.manager = manager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@RequestBody LoginDTO login) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(login.getUsername(), login.getPassword());
        Authentication auth = manager.authenticate(token);
        String jwtToken = jwtService.generateToken((User) auth.getPrincipal());
        return ResponseEntity.ok(new TokenDTO(jwtToken));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody LoginDTO login) {
        UserDTO userDTO = userService.createUser(login);
        return ResponseEntity.ok(userDTO);
    }
}

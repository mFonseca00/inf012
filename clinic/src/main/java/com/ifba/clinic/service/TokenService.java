package com.ifba.clinic.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.ifba.clinic.model.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            var alg = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("Clinic API")
                    .withSubject(user.getUsername())
                    .withExpiresAt(generateExpirationDate())
                    .sign(alg);
            return token;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error generating JWT token: ", e);
        }
    }

    public String validateToken(String token) {
        try {
            var alg = Algorithm.HMAC256(secret);
            return JWT.require(alg)
                    .withIssuer("Clinic API")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (Exception e) {
            return "";
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}

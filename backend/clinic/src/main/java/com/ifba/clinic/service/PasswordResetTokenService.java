package com.ifba.clinic.service;

import com.ifba.clinic.exception.InvalidTokenException;
import com.ifba.clinic.model.entity.PasswordResetToken;
import com.ifba.clinic.model.entity.User;
import com.ifba.clinic.repository.PasswordResetTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    private static final int EXPIRATION_MINUTES = 30;

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetTokenService(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Transactional
    public String createToken(User user) {
        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        resetToken.setUsed(false);

        tokenRepository.save(resetToken);
        return token;
    }

    @Transactional
    public User validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Token inválido"));

        if (resetToken.getUsed()) {
            throw new InvalidTokenException("Token já foi utilizado");
        }

        if (resetToken.isExpired()) {
            throw new InvalidTokenException("Token expirado");
        }

        return resetToken.getUser();
    }

    @Transactional
    public void markTokenAsUsed(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Token inválido"));

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }
}
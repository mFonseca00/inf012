package com.ifba.mail.dto;

public record EmailDTO(
        Long userId,
        String emailTo,
        String subject,
        String body
) { }

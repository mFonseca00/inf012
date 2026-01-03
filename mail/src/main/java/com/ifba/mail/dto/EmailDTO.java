package com.ifba.mail.dto;

public record EmailDTO(
        Long id,
        String subject,
        String body
) { }

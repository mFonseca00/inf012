package com.ifba.clinic.dto.email;

public record EmailDTO(
        Long userId,
        String emailTo,
        String subject,
        String body
) { }

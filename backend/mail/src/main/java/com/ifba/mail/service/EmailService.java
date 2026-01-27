package com.ifba.mail.service;

import com.ifba.mail.model.entity.Email;
import com.ifba.mail.model.enums.EmailStatus;
import com.ifba.mail.repository.EmailRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    private final EmailRepository emailRepository;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(EmailRepository emailRepository, JavaMailSender mailSender) {
        this.emailRepository = emailRepository;
        this.mailSender = mailSender;
    }

    @Transactional
    public Email sendEmail(Email email) {
        if (email.getEmailTo().equals(email.getEmailFrom())) {
            System.out.println("Tentativa de enviar email para o mesmo endereço: " + email.getEmailTo());
            email.setStatus(EmailStatus.FALHA);
            return emailRepository.save(email);
        }
        try{
            email.setSentDate(LocalDateTime.now());
            email.setEmailFrom(fromAddress);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email.getEmailTo());
            message.setSubject(email.getSubject());
            message.setText(email.getBody());
            mailSender.send(message);

            email.setStatus(EmailStatus.ENVIADO);
        } catch (MailException e) {
            email.setStatus(EmailStatus.FALHA);
        }
        return emailRepository.save(email);
    }
}

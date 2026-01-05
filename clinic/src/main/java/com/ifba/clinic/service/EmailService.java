package com.ifba.clinic.service;

import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.email.EmailDTO;
import com.ifba.clinic.producer.EmailProducer;

@Service
public class EmailService {

    private final EmailProducer emailProducer;

    public EmailService(EmailProducer emailProducer) {
        this.emailProducer = emailProducer;
    }

    public void sendUserRegistrationEmail(Long id, String email) {
        EmailDTO emailDTO = new EmailDTO(
                id,
                email,
                "Bem-vindo à Clínica IFBA",
                "Olá,\n\n" +
                "Seja bem-vindo(a) à Clínica IFBA!\n\n" +
                "Seu cadastro foi realizado com sucesso. Agora você pode acessar nossos serviços.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica IFBA"
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    void sendPasswordChangeConfirmationEmail(Long id, String email) {
        EmailDTO emailDTO = new EmailDTO(
                id,
                email,
                "Confirmação de Alteração de Senha - Clínica IFBA",
                "Olá,\n\n" +
                "Sua senha foi alterada com sucesso.\n\n" +
                "Se você não realizou esta alteração, entre em contato conosco imediatamente.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica IFBA"
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    void sendUserAutoRegistrationEmail(Long id, String email) {
        EmailDTO emailDTO = new EmailDTO(
                id,
                email,
                "Cadastro Automático Realizado - Clínica IFBA",
                "Olá,\n\n" +
                "Um cadastro de usuário foi criado automaticamente para você na Clínica IFBA.\n\n" +
                "Sua senha temporária é: temp123\n" +
                "Por favor, altere sua senha no primeiro acesso.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica IFBA"
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

}
package com.ifba.clinic.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ifba.clinic.dto.email.EmailDTO;
import com.ifba.clinic.producer.EmailProducer;

@Service
public class EmailService {

    private final EmailProducer emailProducer;

    public EmailService(EmailProducer emailProducer) {
        this.emailProducer = emailProducer;
    }

    public void sendUserRegistrationEmail(Long userId, String email) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Bem-vindo à Clínica Kos",
                "Olá,\n\n" +
                "Seja bem-vindo(a) à Clínica Kos!\n\n" +
                "Seu cadastro foi realizado com sucesso. Agora você pode acessar nossos serviços.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica Kos"
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendPasswordChangeConfirmationEmail(Long userId, String email) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Confirmação de Alteração de Senha - Clínica Kos",
                "Olá,\n\n" +
                "Sua senha foi alterada com sucesso.\n\n" +
                "Se você não realizou esta alteração, entre em contato conosco imediatamente.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica Kos"
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendPasswordResetEmail(Long userId, String email, String username, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Recuperação de Senha - Clínica Kos",
                String.format("""
                Olá, %s!
                
                Você solicitou a recuperação de senha da sua conta no sistema Kos.
                
                Clique no link abaixo para redefinir sua senha:
                %s
                
                Este link expira em 30 minutos.
                
                Se você não solicitou esta recuperação, ignore este email.
                
                Atenciosamente,
                Equipe Clínica Kos
                """, username, resetLink)
        );

        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendUserAutoRegistrationEmail(Long userId, String email, String username) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Cadastro Automático Realizado - Clínica Kos",
                "Olá,\n\n" +
                "Um cadastro de usuário foi criado automaticamente para você na Clínica Kos.\n\n" +
                "Seu nome de usuário é: " + username + "\n" +
                "Sua senha temporária é: temp123\n" +
                "Por favor, altere sua senha no primeiro acesso.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica Kos"
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendAppointmentConfirmationToPatient(Long userId, String email, String patientName, 
            String doctorName, LocalDateTime appointmentDate) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Consulta Agendada - Clínica Kos",
                String.format(
                        "Olá %s,\n\n" +
                        "Sua consulta foi agendada com sucesso!\n\n" +
                        "Detalhes da consulta:\n" +
                        "Médico(a): Dr(a). %s\n" +
                        "Data: %s\n" +
                        "Horário: %s\n\n" +
                        "Por favor, chegue com 15 minutos de antecedência.\n\n" +
                        "Atenciosamente,\n" +
                        "Equipe Clínica Kos",
                        patientName,
                        doctorName,
                        appointmentDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        appointmentDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
                )
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendAppointmentNotificationToDoctor(Long userId, String email, String doctorName,
            String patientName, LocalDateTime appointmentDate) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Nova Consulta Agendada - Clínica Kos",
                String.format(
                        "Olá Dr(a). %s,\n\n" +
                        "Uma nova consulta foi agendada em sua agenda.\n\n" +
                        "Detalhes da consulta:\n" +
                        "Paciente: %s\n" +
                        "Data: %s\n" +
                        "Horário: %s\n\n" +
                        "Atenciosamente,\n" +
                        "Equipe Clínica Kos",
                        doctorName,
                        patientName,
                        appointmentDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        appointmentDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
                )
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendAppointmentCancellationToPatient(Long userId, String email, String patientName,
            String doctorName, LocalDateTime appointmentDate,
            String reason) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Consulta Cancelada - Clínica Kos",
                String.format(
                        "Olá %s,\n\n" +
                        "Sua consulta foi cancelada.\n\n" +
                        "Detalhes da consulta cancelada:\n" +
                        "Médico(a): Dr(a). %s\n" +
                        "Data: %s\n" +
                        "Horário: %s\n" +
                        "Motivo: %s\n\n" +
                        "Para reagendar, entre em contato conosco.\n\n" +
                        "Atenciosamente,\n" +
                        "Equipe Clínica Kos",
                        patientName,
                        doctorName,
                        appointmentDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        appointmentDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")),
                        reason
                )
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendAppointmentCancellationToDoctor(Long userId, String email, String doctorName,
            String patientName, LocalDateTime appointmentDate,
            String reason) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Consulta Cancelada - Clínica Kos",
                String.format(
                        "Olá Dr(a). %s,\n\n" +
                        "Uma consulta em sua agenda foi cancelada.\n\n" +
                        "Detalhes da consulta cancelada:\n" +
                        "Paciente: %s\n" +
                        "Data: %s\n" +
                        "Horário: %s\n" +
                        "Motivo: %s\n\n" +
                        "Atenciosamente,\n" +
                        "Equipe Clínica Kos",
                        doctorName,
                        patientName,
                        appointmentDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                        appointmentDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")),
                        reason
                )
        );
        emailProducer.publishEmailMessage(emailDTO);
    }

    public void sendAppointmentCompletionToPatient(Long userId, String email, String patientName,
                String doctorName, LocalDateTime appointmentDate) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Consulta Realizada - Clínica Kos",
                String.format(
                "Olá %s,\n\n" +
                "Sua consulta foi concluída com sucesso!\n\n" +
                "Detalhes da consulta:\n" +
                "Médico(a): Dr(a). %s\n" +
                "Data: %s\n" +
                "Horário: %s\n\n" +
                "Obrigado por confiar em nossos serviços.\n\n" +
                "Atenciosamente,\n" +
                "Equipe Clínica Kos",
                patientName,
                doctorName,
                appointmentDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                appointmentDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
                )
        );
        emailProducer.publishEmailMessage(emailDTO);
     }

     public void sendAppointmentCompletionToDoctor(Long userId, String email, String doctorName,
                String patientName, LocalDateTime appointmentDate) {
        EmailDTO emailDTO = new EmailDTO(
                userId,
                email,
                "Consulta Realizada - Clínica Kos",
                String.format(
                "Olá Dr(a). %s,\n\n" +
                "A consulta foi registrada como realizada.\n\n" +
                "Detalhes:\n" +
                "Paciente: %s\n" +
                "Data: %s\n" +
                "Horário: %s\n\n" +
                "Atenciosamente,\n" +
                "Sistema Clínica Kos",
                doctorName,
                patientName,
                appointmentDate.toLocalDate().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                appointmentDate.toLocalTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"))
                )
        );
        emailProducer.publishEmailMessage(emailDTO);
     }
}
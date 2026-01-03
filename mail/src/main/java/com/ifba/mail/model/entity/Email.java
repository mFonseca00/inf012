package com.ifba.mail.model.entity;

import com.ifba.mail.model.enums.EmailStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tb_email")
public class Email {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ownerId;

    private String emailTo;

    private String emailFrom;

    private String subject;

    @Column(columnDefinition = "BODY")
    private String body;

    private LocalDateTime sentDate = LocalDateTime.now();

    private EmailStatus status;
}

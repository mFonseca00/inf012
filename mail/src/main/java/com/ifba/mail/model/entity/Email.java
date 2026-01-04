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

    private Long userId;

    private String emailTo;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String body;

    private LocalDateTime sentDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private EmailStatus status;
}

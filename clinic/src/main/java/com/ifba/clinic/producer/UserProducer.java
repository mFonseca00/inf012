package com.ifba.clinic.producer;

import com.ifba.clinic.dto.email.EmailDTO;
import com.ifba.clinic.model.entity.User;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class UserProducer {

    final RabbitTemplate rabbitTemplate;

    public UserProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Value("${broker.queue.email.name}")
    private String routingKey;

    // TODO: Refatorar para usar em um service de email e ser reutilizável em várias siturações dentro de outros services
    //  (deve receber a string de assunto e corpo do email como parâmetro - possivel DTO com todos os dados)

    public void publishEmailMessage(User user) {
        EmailDTO emailDTO = new EmailDTO(
                user.getId(),
                user.getEmail(),
                "Welcome to IFBA Clinic",
                "Dear " + user.getUsername() + ",\n\nThank you for registering at IFBA Clinic.\n\nBest regards,\nIFBA Clinic Team"
        );

        rabbitTemplate.convertAndSend("",routingKey, emailDTO);
    }

}

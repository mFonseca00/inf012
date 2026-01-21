package com.ifba.clinic.producer;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ifba.clinic.dto.email.EmailDTO;

@Component
public class EmailProducer {

    final RabbitTemplate rabbitTemplate;

    public EmailProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Value("${broker.queue.email.name}")
    private String routingKey;

    public void publishEmailMessage(EmailDTO emailDTO) {
        rabbitTemplate.convertAndSend("",routingKey, emailDTO);
    }

}

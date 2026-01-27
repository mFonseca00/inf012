package com.ifba.mail;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MailApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
								.ignoreIfMissing()
								.load();
		
		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		
		SpringApplication.run(MailApplication.class, args);
	}

}

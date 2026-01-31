package com.ifba.clinic.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/monitoring")
@Tag(name = "Monitoramento", description = "Endpoints para monitoramento de serviços")
public class MonitoringController {

    private DiscoveryClient discoveryClient;

    MonitoringController(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @GetMapping("/services")
    @Operation(summary = "Listar serviços disponíveis",
            description = "Retorna todos os serviços registrados no Eureka")
    public ResponseEntity<Map<String, Object>> getAvailableServices() {
        List<String> services = discoveryClient.getServices();
        Map<String, Object> response = new HashMap<>();
        response.put("total_services", services.size());
        response.put("services", services);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/services/details")
    @Operation(summary = "Detalhes dos serviços",
            description = "Retorna informações detalhadas de todos os serviços")
    public ResponseEntity<Map<String, List<ServiceInstance>>> getServicesDetails() {
        List<String> services = discoveryClient.getServices();
        Map<String, List<ServiceInstance>> servicesInfo = new HashMap<>();
        for (String service : services) {
            List<ServiceInstance> instances = discoveryClient.getInstances(service);
            servicesInfo.put(service, instances);
        }
        return ResponseEntity.ok(servicesInfo);
    }

    @GetMapping("/health")
    @Operation(summary = "Status de saúde dos serviços",
            description = "Verifica se os serviços críticos estão disponíveis")
    public ResponseEntity<Map<String, Object>> getServicesHealth() {
        Map<String, Object> health = new HashMap<>();
        // Verificar Clinic Service
        List<ServiceInstance> clinicInstances = discoveryClient.getInstances("clinic");
        health.put("clinic-service", Map.of(
                "status", !clinicInstances.isEmpty() ? "UP" : "DOWN",
                "instances", clinicInstances.size()
        ));
        // Verificar Mail Service
        List<ServiceInstance> mailInstances = discoveryClient.getInstances("mail");
        health.put("mail-service", Map.of(
                "status", !mailInstances.isEmpty() ? "UP" : "DOWN",
                "instances", mailInstances.size()
        ));
        // Status geral
        boolean allServicesUp = !clinicInstances.isEmpty() && !mailInstances.isEmpty();
        health.put("overall_status", allServicesUp ? "HEALTHY" : "DEGRADED");
        return ResponseEntity.ok(health);
    }
}

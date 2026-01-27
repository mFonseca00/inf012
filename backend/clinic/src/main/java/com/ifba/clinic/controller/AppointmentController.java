package com.ifba.clinic.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.appointment.AppointmentCancelationDTO;
import com.ifba.clinic.dto.appointment.AppointmentConclusionDTO;
import com.ifba.clinic.dto.appointment.AppointmentRegDTO;
import com.ifba.clinic.dto.appointment.AppointmentResponseDTO;
import com.ifba.clinic.service.AppointmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/appointment")
@Tag(name = "Consultas", description = "Endpoints para gerenciamento de consultas")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/schedule")
    @Operation(summary = "Agendar nova consulta", description = "Agenda uma nova consulta no sistema.")
    public ResponseEntity<String> scheduleAppointment(@RequestBody @Valid AppointmentRegDTO appointmentDTO) {
        appointmentService.scheduleAppointment(appointmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Consulta agendada com sucesso");
    }

    @PatchMapping("/cancel")
    @Operation(summary = "Cancelar consulta", description = "Cancela uma consulta existente.")
    public ResponseEntity<String> cancelAppointment(@RequestBody @Valid AppointmentCancelationDTO cancelationDTO) {
        appointmentService.cancelAppointment(cancelationDTO);
        return ResponseEntity.ok("Consulta cancelada com sucesso");
    }

    @PatchMapping("/conclude")
    @Operation(summary = "Concluir consulta", description = "Marca uma consulta como realizada.")
    public ResponseEntity<String> concludeAppointment(@RequestBody @Valid AppointmentConclusionDTO conclusionDTO) {
        appointmentService.concludeAppointment(conclusionDTO);
        return ResponseEntity.ok("Consulta concluída com sucesso");
    }

    @GetMapping("/all")
    @Operation(summary = "Listar todas as consultas", description = "Retorna uma lista paginada de todas as consultas.")
    public ResponseEntity<Page<AppointmentResponseDTO>> getAllAppointments(Pageable pageable) {
        Page<AppointmentResponseDTO> appointments = appointmentService.getAllAppointments(pageable);
        if (appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter consulta por ID", description = "Retorna os dados da consulta com base no ID.")
    public ResponseEntity<AppointmentResponseDTO> getAppointment(@PathVariable Long id) {
        AppointmentResponseDTO appointment = appointmentService.getAppointment(id);
        return ResponseEntity.ok(appointment);
    }
}

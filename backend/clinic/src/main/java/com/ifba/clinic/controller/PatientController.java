package com.ifba.clinic.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.dto.patient.PatientInactivationDTO;
import com.ifba.clinic.dto.patient.PatientRegDTO;
import com.ifba.clinic.dto.patient.PatientResponseDTO;
import com.ifba.clinic.dto.patient.PatientUpdateDTO;
import com.ifba.clinic.service.PatientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/patient")
@Tag(name = "Pacientes", description = "Endpoints para gerenciamento de pacientes")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar novo paciente", description = "Registra um novo paciente no sistema.")
    public ResponseEntity<String> register(@RequestBody @Valid PatientRegDTO patientDTO) {
        patientService.register(patientDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Paciente registrado com sucesso");
    }

    @PatchMapping("/update")
    @Operation(summary = "Atualizar dados do paciente", description = "Atualiza os dados de um paciente existente.")
    public ResponseEntity<String> update(@RequestBody @Valid PatientUpdateDTO patientDTO) {
        patientService.update(patientDTO);
        return ResponseEntity.ok("Registro de paciente atualizado com sucesso");
    }

    @PatchMapping("/inactivate")
    @Operation(summary = "Inativar paciente", description = "Inativa um paciente existente.")
    public ResponseEntity<String> inactivate(@RequestBody @Valid PatientInactivationDTO patientDTO) {
        patientService.inactivate(patientDTO);
        return ResponseEntity.ok("Paciente inativado com sucesso");
    }

    @GetMapping("/all")
    @Operation(summary = "Listar todos os pacientes", description = "Retorna uma lista paginada de todos os pacientes.")
    public ResponseEntity<Page<PatientResponseDTO>> getAllPatients(Pageable pageable) {
        Page<PatientResponseDTO> patients = patientService.getAllPatients(pageable);
        if (patients.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(patients);
    }

    @GetMapping
    @Operation(summary = "Obter paciente por CPF", description = "Retorna os dados do paciente com base no CPF.")
    public ResponseEntity<PatientResponseDTO> getPatient(
            @RequestParam
            @Pattern(regexp = "^(\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{11})$", message = "CPF inválido")
            String cpf) {
        PatientResponseDTO patient = patientService.getPatientByCPF(cpf);
        return ResponseEntity.ok(patient);
    }
}

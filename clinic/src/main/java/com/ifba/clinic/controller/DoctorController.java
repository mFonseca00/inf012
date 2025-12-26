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

import com.ifba.clinic.dto.doctor.DoctorInactivationDTO;
import com.ifba.clinic.dto.doctor.DoctorRegDTO;
import com.ifba.clinic.dto.doctor.DoctorRsponseDTO;
import com.ifba.clinic.dto.doctor.DoctorUpdateDTO;
import com.ifba.clinic.service.DoctorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;

@RestController
@RequestMapping("/doctor")
@Tag(name = "Médicos", description = "Endpoints para gerenciamento de médicos")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar novo médico", description = "Registra um novo médico no sistema.")
    public ResponseEntity<String> register(@RequestBody @Valid DoctorRegDTO doctorDTO) {
        doctorService.register(doctorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Médico registrado com sucesso");
    }

    @PatchMapping("/update")
    @Operation(summary = "Atualizar dados do médico", description = "Atualiza os dados de um médico existente.")
    public ResponseEntity<String> update(@RequestBody @Valid DoctorUpdateDTO doctorDTO) {
        doctorService.update(doctorDTO);
        return ResponseEntity.ok("Registro de médico atualizado com sucesso");
    }

    @PatchMapping("/inactivate")
    @Operation(summary = "Inativar médico", description = "Inativa um médico existente.")
    public ResponseEntity<String> inactivate(@RequestBody @Valid DoctorInactivationDTO doctorDTO) {
        doctorService.inactivate(doctorDTO);
        return ResponseEntity.ok("Médico inativado com sucesso");
    }

    @GetMapping("/all")
    @Operation(summary = "Listar todos os médicos", description = "Retorna uma lista paginada de todos os médicos.")
    public ResponseEntity<Page<DoctorRsponseDTO>> getAllDoctors(Pageable pageable) {
        Page<DoctorRsponseDTO> doctors = doctorService.getAllDoctors(pageable);
        if (doctors.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(doctors);
    }

    @GetMapping
    @Operation(summary = "Obter médico por CRM", description = "Retorna os dados do médico com base no CRM.")
    public ResponseEntity<DoctorRsponseDTO> getDoctor(
        @RequestParam 
        @Pattern(regexp = "^\\d{6}-\\d{2}\\/[A-Z]{2}$", message = "CRM inválido")
        String crm) {
        DoctorRsponseDTO doctor = doctorService.getDoctor(crm);
        return ResponseEntity.ok(doctor);
    }
}

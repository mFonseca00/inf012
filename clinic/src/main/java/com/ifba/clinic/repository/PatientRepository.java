package com.ifba.clinic.repository;

import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Patient;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    boolean existsByAddress(Address address);
    Patient findByCpf(String cpf);

}

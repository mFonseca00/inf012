package com.ifba.clinic.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Patient;
import com.ifba.clinic.model.entity.User;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByCpf(String cpf);
    boolean existsByAddress(Address address);
    boolean existsByUser(User user);
    Patient findByCpf(String cpf);

}

package com.ifba.clinic.repository;

import com.ifba.clinic.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifba.clinic.model.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    boolean existsByCrm(String crm);
    Doctor findByCrm(String crm);
    boolean existsByAddress(Address address);
}

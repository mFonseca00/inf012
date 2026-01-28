package com.ifba.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifba.clinic.model.entity.Address;
import com.ifba.clinic.model.entity.Doctor;
import com.ifba.clinic.model.entity.User;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    boolean existsByCrm(String crm);
    boolean existsByAddress(Address address);
    boolean existsByUser(User user);
    Doctor findByCrm(String crm);
}

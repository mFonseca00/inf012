package com.ifba.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifba.clinic.model.entity.AppointmentCancelation;

@Repository
public interface AppointmentCancelationRepository extends JpaRepository<AppointmentCancelation, Long> {
}

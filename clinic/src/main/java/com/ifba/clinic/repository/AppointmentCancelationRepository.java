package com.ifba.clinic.repository;

import com.ifba.clinic.model.entity.AppointmentCancelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentCancelationRepository extends JpaRepository<AppointmentCancelation, Long> {
}

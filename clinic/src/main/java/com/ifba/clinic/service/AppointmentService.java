package com.ifba.clinic.service;

import com.ifba.clinic.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    AppointmentRepository appointmentRepository;

    AppointmentService(AppointmentRepository appointmentRepository){
        this.appointmentRepository = appointmentRepository;
    }
}

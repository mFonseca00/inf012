package com.ifba.clinic.controller;

import com.ifba.clinic.repository.AppointmentRepository;
import com.ifba.clinic.service.AppointmentService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AppointmentController {

    AppointmentService appointmentService;

    AppointmentController(AppointmentService appointmentService){
        this.appointmentService = appointmentService;
    }
}

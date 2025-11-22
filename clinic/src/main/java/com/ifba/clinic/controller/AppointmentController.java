package com.ifba.clinic.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.service.AppointmentService;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService){
        this.appointmentService = appointmentService;
    }
}

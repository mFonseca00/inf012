package com.ifba.clinic.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ifba.clinic.service.AppointmentService;

@RestController
public class AppointmentController {

    AppointmentService appointmentService;

    AppointmentController(AppointmentService appointmentService){
        this.appointmentService = appointmentService;
    }
}

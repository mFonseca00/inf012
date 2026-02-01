package com.ifba.clinic.model.enums;

public enum AppointmentStatus {
    ATIVA("Consulta ativa"),
    CANCELADA("Consulta cancelada pelo médico"),
    DESISTENCIA("Consulta cancelada pelo paciente"),
    REALIZADA("Consulta realizada");

    private final String displayName;

    AppointmentStatus(String displayName){
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return name();
    }


    public static AppointmentStatus fromString(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        try {
            return AppointmentStatus.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException e) {
            for (AppointmentStatus s : values()) {
                if (s.displayName.equalsIgnoreCase(normalized)) return s;
            }
            throw new IllegalArgumentException("Unknown AppointmentStatus: " + value);
        }
    }
}

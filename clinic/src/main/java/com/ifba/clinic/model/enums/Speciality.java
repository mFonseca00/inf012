package com.ifba.clinic.model.enums;

public enum Speciality {
    ORTOPEDIA("Ortopedia"),
    CARDIOLOGIA("Cardiologia"),
    GINECOLOGIA("Ginecologia"),
    DERMATOLOGIA("Dermatologia");

    private final String displayName;

    Speciality(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return name();
    }


    public static Speciality fromString(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        try {
            return Speciality.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException e) {
            for (Speciality s : values()) {
                if (s.displayName.equalsIgnoreCase(normalized)) return s;
            }
            throw new IllegalArgumentException("Unknown Speciality: " + value);
        }
    }
}

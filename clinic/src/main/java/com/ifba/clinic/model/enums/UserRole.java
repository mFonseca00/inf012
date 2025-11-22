package com.ifba.clinic.model.enums;

public enum UserRole {
    MASTER("Master Administrator"),
    ADMIN("Administrator"),
    USER("User");

    private final String displayName;

    UserRole(String displayName){
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return name();
    }

    public static UserRole fromString(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        try {
            return UserRole.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException e) {
            for (UserRole s : values()) {
                if (s.displayName.equalsIgnoreCase(normalized)) return s;
            }
            throw new IllegalArgumentException("Unknown UserRole: " + value);
        }
    }

}

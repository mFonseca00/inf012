package com.api.agenda.model.enums;

public enum UserRole {
    ADMIN("administrador"),
    USER("usuario");

    private String roleType;

    UserRole(String roleType){
        this.roleType = roleType;
    }

    public String getRoleType() {
        return roleType;
    }

    @Override
    public String toString(){ return name(); }
}

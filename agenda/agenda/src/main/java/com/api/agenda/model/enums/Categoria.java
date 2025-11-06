package com.api.agenda.model.enums;

public enum Categoria {
    PESSOAL("Pessoal"),
    PROFISSIONAL("Profissional"),
    RESIDENCIAL("Residencial"),
    CELULAR("Celular"),
    OUTROS("Outros");

    private String roleType;

    Categoria(String roleType){
        this.roleType = roleType;
    }

    public String getRoleType() {
        return roleType;
    }

    @Override
    public String toString(){ return name(); }
}

package com.api.agenda.model.entity;

import org.springframework.security.core.GrantedAuthority;

import com.api.agenda.dto.RoleDTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String role;

    public Role() { super(); }
    public Role(Long id, String role) {
        super();
        this.id = id;
        this.role = role;
    }
    public Role(RoleDTO dto){
        this.id = dto.getId();
        this.role = dto.getRole();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    @Override
    public String getAuthority() {
        return role;
    }
}

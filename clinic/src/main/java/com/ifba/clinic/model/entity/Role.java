package com.ifba.clinic.model.entity;

import com.ifba.clinic.model.enums.UserRole;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "roles")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", columnDefinition = "role_enum")
    private UserRole role;

    public Role(UserRole role) {
        this.role = role;
    }

    @Override
    public String getAuthority() {
        return role.toString();
    }
}

package com.ifba.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.ifba.clinic.model.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}

package com.api.agenda.dto;

import com.api.agenda.model.entity.User;

public class UserDTO {

    private Long id;
    private String username;

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
}

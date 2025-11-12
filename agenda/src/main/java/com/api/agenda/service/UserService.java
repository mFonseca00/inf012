package com.api.agenda.service;

import com.api.agenda.dto.LoginDTO;
import com.api.agenda.dto.UserDTO;
import com.api.agenda.model.entity.User;
import com.api.agenda.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UserService (UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public UserDTO createUser(LoginDTO loginDTO) {
        User user = new User(loginDTO);
        user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
        userRepository.save(user);
        return new UserDTO(user);
    }

    public UserDTO deleteUser(Long id) {
        User user = userRepository.getReferenceById(id);
        userRepository.deleteById(id);
        return new UserDTO(user);
    }

    public java.util.List<UserDTO> listAllUsers() {
        return userRepository.findAll().stream().map(UserDTO::new).toList();
    }
}

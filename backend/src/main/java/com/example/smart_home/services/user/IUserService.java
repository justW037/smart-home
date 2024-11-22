package com.example.smart_home.services.user;

import com.example.smart_home.DTOs.userDTO.UserRegisterDTO;
import com.example.smart_home.DTOs.userDTO.UserUpdateDTO;
import com.example.smart_home.models.User;

public interface IUserService {
    // Page<User> findAll(String keyword, Pageable pageable);
    User createUser(UserRegisterDTO userDTO) throws Exception;
    String login(String email, String password, Long roleId) throws Exception;
    User getUserDetailsFromToken(String token) throws Exception;
    User updateUser(Long userId, UserUpdateDTO updatedUserDTO) throws Exception;
    // User getUserDetailsById(Long id) throws Exception;
    void deleteUser(String token ,Long userId) throws Exception;
}

package com.example.smart_home.services.user;


import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.smart_home.DTOs.userDTO.UserRegisterDTO;
import com.example.smart_home.DTOs.userDTO.UserUpdateDTO;
import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.exceptions.PermissionDenyException;
import com.example.smart_home.models.Role;
import com.example.smart_home.models.User;
import com.example.smart_home.repositories.RoleRepository;
import com.example.smart_home.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService implements IUserService{

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    @Transactional
    public User createUser(UserRegisterDTO userDTO) throws Exception{
        String email = userDTO.getEmail();

        if(userRepository.existsByEmail(email)) {
            // Constraint exception
            throw new DataIntegrityViolationException("Email already exists");
        }
        Role role = roleRepository.findById(userDTO.getRole())
            .orElseThrow(()-> new DataNotFoundException("User login role not exist"));
        if(role.getName().toUpperCase().equals(Role.ADMIN)) {
            throw new PermissionDenyException("Not allowed to register for an Admin account");
        }
        User newUser = User.builder()
                    .username(userDTO.getUsername())
                    .email(userDTO.getEmail())
                    .build();
        newUser.setRole(role);
        String password = userDTO.getPassword();
        String encodedPassword = passwordEncoder.encode(password);
        newUser.setPassword(encodedPassword);

        return userRepository.save(newUser);
    }

    @Override
    public String login(String email, String password, Long roleId) throws Exception{
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isEmpty()) {
            throw new DataNotFoundException("Fail to login!");
        }
        User existingUser = optionalUser.get();
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password, existingUser.getAuthorities()
        );
        authenticationManager.authenticate(authenticationToken);
        String token = jwtTokenUtil.generateToken(existingUser);
        return token;
    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        String email = jwtTokenUtil.extractEmail(token);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new Exception("User not found");
        }
    }

    @Transactional
    @Override
    public User updateUser(Long userId, UserUpdateDTO updatedUserDTO) throws Exception{
        if (updatedUserDTO.getPassword() != null
        && !updatedUserDTO.getPassword().isEmpty()) {
            if(!updatedUserDTO.getPassword().equals(updatedUserDTO.getRetypePassword())) {
                throw new DataNotFoundException("Password and retype password not the same");
            }
            
            // String newPassword = updatedUserDTO.getPassword();
            // String encodedPassword = passwordEncoder.encode(newPassword);
            // existingUser.setPassword(encodedPassword);
        }
        User existingUser = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found"));

        if (!passwordEncoder.matches(updatedUserDTO.getPassword(), existingUser.getPassword())) {
            throw new IllegalArgumentException("Password not match");
        }
        String newEmail = updatedUserDTO.getEmail();

        if (!existingUser.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new DataIntegrityViolationException("Email already exists");
        }
        if (updatedUserDTO.getUsername() != null) {
            existingUser.setUsername(updatedUserDTO.getUsername());
        }
        if (newEmail != null) {
            existingUser.setEmail(newEmail);
        }

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(String token , Long userId) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        User user = userRepository.findById(userId).orElseThrow(()-> new DataNotFoundException("User not found"));
        if (user.getId() != jwtTokenUtil.extractUserId(token)) {
            throw new PermissionDenyException("Can't delete user , id not match");
        }
        userRepository.delete(user);
    }
}

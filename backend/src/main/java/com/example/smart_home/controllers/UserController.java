package com.example.smart_home.controllers;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_home.DTOs.userDTO.UserLoginDTO;
import com.example.smart_home.DTOs.userDTO.UserRegisterDTO;
import com.example.smart_home.DTOs.userDTO.UserUpdateDTO;
import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.models.Token;
import com.example.smart_home.models.User;
import com.example.smart_home.responses.userResponse.DeleteUserResponse;
import com.example.smart_home.responses.userResponse.LoginResponse;
import com.example.smart_home.responses.userResponse.RegisterResponse;
import com.example.smart_home.responses.userResponse.UserDetailResponse;
import com.example.smart_home.services.token.ITokenService;
import com.example.smart_home.services.user.IUserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final ITokenService tokenService;
    // private final JwtTokenUtil jwtTokenUtil;
    @GetMapping("test")
    public String method(Authentication authentication) {
        if (authentication instanceof AnonymousAuthenticationToken) {
            return "anonymous";
        } else {
            return "not anonymous";
        }
    }
    

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> createUser(@Valid @RequestBody UserRegisterDTO userDTO, BindingResult result) {
        RegisterResponse registerResponse = new RegisterResponse();

        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            registerResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(registerResponse);
        }

        if (!userDTO.getPassword().equals(userDTO.getRetypePassword())) {
            registerResponse.setMessage("User register password not match");
            return ResponseEntity.badRequest().body(registerResponse);
        }

        try {
            User user = userService.createUser(userDTO);
            registerResponse.setMessage("Register successfully!");
            UserDetailResponse  userDetailResponse = UserDetailResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().getName())
                    .build();

            registerResponse.setUser(userDetailResponse);
            return ResponseEntity.ok(registerResponse);
        } catch (Exception e) {
            registerResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(registerResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody UserLoginDTO userLoginDTO,
            HttpServletRequest request) {
        try {
            String token = userService.login(
                    userLoginDTO.getEmail(),
                    userLoginDTO.getPassword(),
                    userLoginDTO.getRoleId() == null ? 1 : userLoginDTO.getRoleId());
            User userDetail = userService.getUserDetailsFromToken(token);

            Token refreshToken = tokenService.refreshToken(userDetail);

            return ResponseEntity.ok(LoginResponse.builder()
                    .message("Login successfully")
                    .token(token)
                    .tokenType(refreshToken.getTokenType())
                    .refreshToken(refreshToken.getRefreshToken())
                    .username(userDetail.getUsername())
                    .roles(userDetail.getAuthorities().stream().map(item -> item.getAuthority()).toList())
                    .id(userDetail.getId())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message("Login failed!")
                            .build());
        }
    }

    @GetMapping("/details")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<UserDetailResponse> getUserDetails(
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String extractedToken = authorizationHeader.substring(7);
            User user = userService.getUserDetailsFromToken(extractedToken);
            return ResponseEntity.ok(UserDetailResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/details/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable Long userId,
            @RequestBody UserUpdateDTO updatedUserDTO,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String extractedToken = authorizationHeader.substring(7);
            User user = userService.getUserDetailsFromToken(extractedToken);
            if (user.getId() != userId) {
                ResponseEntity.badRequest().body("Cannot update user information, id not match");
            }
            User updatedUser = userService.updateUser(userId, updatedUserDTO);
            return ResponseEntity.ok(UserDetailResponse.fromUser(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long id) {
        DeleteUserResponse deleteUserResponse = new DeleteUserResponse();
        try {
            String extractedToken = authorizationHeader.substring(7);
            userService.deleteUser(extractedToken, id);
            deleteUserResponse.setMessage("User deleted successfully");
            deleteUserResponse.setUserId(id);
            return ResponseEntity.ok(deleteUserResponse);
        } catch (Exception e) {
            deleteUserResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(deleteUserResponse);
        }
    }


}

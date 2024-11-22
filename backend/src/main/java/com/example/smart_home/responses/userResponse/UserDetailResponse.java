package com.example.smart_home.responses.userResponse;



import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;

import java.time.LocalDate;

import com.example.smart_home.models.Role;
import com.example.smart_home.models.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDetailResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("username")
    private String username;

    @JsonProperty("email")
    private String email;

    @JsonProperty("role_name")
    private String role;

    public static UserDetailResponse fromUser(User user) {  
        return UserDetailResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole().getName())
                            .build();
    }

}

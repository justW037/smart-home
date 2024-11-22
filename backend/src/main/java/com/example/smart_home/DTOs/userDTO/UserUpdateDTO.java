package com.example.smart_home.DTOs.userDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.Date;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateDTO {
    @JsonProperty("username")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @JsonProperty("password")
    private String password;

    @JsonProperty("retype_password")
    private String retypePassword;

    @NotBlank(message = "Email cannot be blank")
    @JsonProperty("email")
    private String email;

}


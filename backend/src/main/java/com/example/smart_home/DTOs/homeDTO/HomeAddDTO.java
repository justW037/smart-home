package com.example.smart_home.DTOs.homeDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HomeAddDTO {
    @NotBlank(message = "Name is required")
    @JsonProperty("home_name")
    private String name;

    @NotNull
    @JsonProperty("u_id")
    private Long userId;

}

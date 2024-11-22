package com.example.smart_home.DTOs.roomDTO;
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
public class RoomAddDTO {
    @NotBlank(message = "Room name is required")
    @JsonProperty("room_name")
    private String name;

    @NotNull
    @JsonProperty("home_id")
    private Long homeId;
}

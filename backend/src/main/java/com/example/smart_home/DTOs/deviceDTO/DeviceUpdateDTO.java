package com.example.smart_home.DTOs.deviceDTO;


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
public class DeviceUpdateDTO {

    @NotNull
    @JsonProperty("device_id")
    private Long id;

    @NotBlank(message = "Device name is required")
    @JsonProperty("device_name")
    private String name;

    @NotNull
    @JsonProperty("type_id")
    private Long typeId;

    @NotNull
    @JsonProperty("room_id")
    private Long roomId;

    @NotBlank(message = "Port is required")
    @JsonProperty("port")
    private String port;
}

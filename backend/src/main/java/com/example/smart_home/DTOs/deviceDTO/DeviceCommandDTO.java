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
public class DeviceCommandDTO {

    @NotNull
    @JsonProperty("home_ip")
    private String homeIp;

    @NotNull
    @JsonProperty("device_id")
    private Long deviceId;

    @NotBlank(message = "Port is required")
    @JsonProperty("port")
    private String port;

    @NotBlank(message = "Command is required")
    @JsonProperty("command")
    private int command;
}

package com.example.smart_home.responses.deviceResponse;

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
public class AddDeviceResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("device")
    private DeviceResponse device;
}

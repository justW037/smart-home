package com.example.smart_home.responses.deviceResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteDeviceResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("device_id")
    private Long deviceId;
}

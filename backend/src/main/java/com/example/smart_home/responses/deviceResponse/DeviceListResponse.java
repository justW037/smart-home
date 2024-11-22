package com.example.smart_home.responses.deviceResponse;


import java.util.List;
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
public class DeviceListResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("devices")
    private List<DeviceResponse> deviceList;

    @JsonProperty("total_page")
    private int totalPages; 
}

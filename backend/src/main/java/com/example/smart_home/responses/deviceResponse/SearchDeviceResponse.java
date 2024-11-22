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
public class SearchDeviceResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("device_name")
    private String name;

    @JsonProperty("type_name")
    private String typeName;

    @JsonProperty("room_name")
    private String roomName;
}

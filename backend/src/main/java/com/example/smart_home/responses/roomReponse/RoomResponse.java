package com.example.smart_home.responses.roomReponse;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("room_name")
    private String name;

    @JsonProperty("home_id")
    private Long homeId;
}

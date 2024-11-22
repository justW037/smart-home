package com.example.smart_home.responses.roomReponse;

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
public class AddRoomResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("room")
    private RoomResponse room;
}

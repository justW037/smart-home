package com.example.smart_home.responses.roomReponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteRoomResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("room_id")
    private Long roomId;
}

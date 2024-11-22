package com.example.smart_home.responses.roomReponse;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoomListResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("rooms")
    private List<RoomResponse> roomList;

    @JsonProperty("total_page")
    private int totalPages;
}

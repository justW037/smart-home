package com.example.smart_home.responses.typeResponse;


import java.util.List;

import com.example.smart_home.responses.roomReponse.RoomResponse;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TypeListResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("types")
    private List<TypeResponse> typeResponse;

    @JsonProperty("total_page")
    private int totalPages;
}

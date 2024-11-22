package com.example.smart_home.responses.homeResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteHomeResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("home_id")
    private Long homeId;
}

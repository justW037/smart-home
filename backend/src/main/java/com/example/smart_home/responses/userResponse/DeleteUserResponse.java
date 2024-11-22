package com.example.smart_home.responses.userResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeleteUserResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("user_id")
    private Long userId;
}

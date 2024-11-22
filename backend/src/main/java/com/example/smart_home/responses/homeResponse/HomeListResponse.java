package com.example.smart_home.responses.homeResponse;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeListResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("homes")
    private List<HomeResponse> homeList;

    @JsonProperty("total_page")
    private int totalPages;
}

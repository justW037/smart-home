package com.example.smart_home.responses.homeResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("home_name")
    private String name;

    @JsonProperty("u_id")
    private Long userId;

    @JsonProperty("home_ip")
    private String homeIp;
}

package com.example.smart_home.responses.typeResponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TypeResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("type_name")
    private String name;
}

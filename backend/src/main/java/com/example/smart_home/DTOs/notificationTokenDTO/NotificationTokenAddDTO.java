package com.example.smart_home.DTOs.notificationTokenDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationTokenAddDTO {
    @NotNull
    @JsonProperty("home_id")
    private Long homeId;

    @NotBlank(message = "NotificationToken is required")
    @JsonProperty("notification_token")
    private String notificationToken;
}

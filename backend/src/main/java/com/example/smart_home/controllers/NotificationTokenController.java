package com.example.smart_home.controllers;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_home.DTOs.notificationTokenDTO.NotificationTokenAddDTO;
import com.example.smart_home.models.NotificationToken;
import com.example.smart_home.services.notificationToken.INoTificationTokenService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/notification-tokens")
@RequiredArgsConstructor
public class NotificationTokenController {
    private final INoTificationTokenService notificationTokenService;

    @PostMapping("/add-token")
    public ResponseEntity<?> addNotificationToken(@RequestHeader("Authorization") String authorizationHeader, @RequestBody NotificationTokenAddDTO notificationTokenAddDTO, BindingResult result ) {
          if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();
            return ResponseEntity.badRequest().body(errorMessages);
        }
        try {
            String extractedToken = authorizationHeader.substring(7);
            notificationTokenService.addNotificationToken(extractedToken, notificationTokenAddDTO);
            return ResponseEntity.ok().body("Add notification token successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/inactive/{notificationToken}")
    public ResponseEntity<?> inactiveNotificationToken(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String notificationToken) {
        try {
            String extractedToken = authorizationHeader.substring(7);
            notificationTokenService.inactiveNotificationToken(extractedToken, notificationToken);
            return ResponseEntity.ok().body("Inactive notification token successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // @GetMapping("/{homeId}")
    // public ResponseEntity<?> findAllByHomeId(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long homeId) {
    //     try {
    //         String extractedToken = authorizationHeader.substring(7);
    //         List<String> notificationTokens = notificationTokenService.findAllByHomeId(extractedToken, homeId);
    //         return ResponseEntity.ok().body(notificationTokens);
    //     } catch (Exception e) {
    //         return ResponseEntity.badRequest().body(e.getMessage());
    //     }
    // }
}

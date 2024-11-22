package com.example.smart_home.services.notificationToken;

import java.util.List;

import com.example.smart_home.DTOs.notificationTokenDTO.NotificationTokenAddDTO;
import com.example.smart_home.models.NotificationToken;

public interface INoTificationTokenService {
    List<String> findAllByHomeId(Long homeId) throws Exception;
    void addNotificationToken(String token, NotificationTokenAddDTO notificationTokenAddDTO) throws Exception;
    void inactiveNotificationToken(String token,  String notificationTokenInactive) throws Exception;

}

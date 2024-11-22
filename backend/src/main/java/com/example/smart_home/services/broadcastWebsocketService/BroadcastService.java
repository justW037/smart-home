package com.example.smart_home.services.broadcastWebsocketService;


import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.repositories.HomeRepository;
import com.example.smart_home.services.notificationToken.INoTificationTokenService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class BroadcastService implements IBroadcastService {
    private final INoTificationTokenService notificationTokenService;
    private final HomeRepository homeRepository;

      @Value("${expo.notification-api}")
    private String notificationApi;

    @Override
    public void broadcastMessage(String token, WebSocketSession senderSession, String message, Set<WebSocketSession> sessions) throws Exception {
        if (sessions != null) {
            synchronized (sessions) {
                for (WebSocketSession session : sessions) {
                    if (!session.equals(senderSession)) {
                        session.sendMessage(new TextMessage(message));
                    }
                }
            }
        }
    }

    @Override
    public void pushNotificationToDevice(String homeIp, String warningMessage) throws Exception  {
        Long homeId = homeRepository.findByIp(homeIp).orElseThrow(()-> new DataNotFoundException("Home not found")).getId();
        List<String> notificationTokens = notificationTokenService.findAllByHomeId(homeId);

        for (String token : notificationTokens) {
            sendPushNotification(token, warningMessage);
        }
    }

    private void sendPushNotification(String pushToken, String warningMessage) throws Exception {
        String expoPushToken = String.format("ExponentPushToken[%s]", pushToken);
        Map<String, Object> message = new HashMap<>();
        message.put("to", expoPushToken);
        message.put("sound", "default");
        message.put("title", "⚠️Warning⚠️");
        message.put("body", warningMessage);
	

        URL url = URI.create(notificationApi).toURL();
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Accept-encoding", "gzip, deflate");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = new ObjectMapper().writeValueAsBytes(message);
            os.write(input, 0, input.length);
        }

        int responseCode = connection.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            throw new Exception("Failed to send push notification, response code: " + responseCode);
        }
    }
}

package com.example.smart_home.services.broadcastWebsocketService;

import java.util.Set;
import org.springframework.web.socket.WebSocketSession;

public interface IBroadcastService {
    void broadcastMessage(String token, WebSocketSession senderSession, String message, Set<WebSocketSession> sessions) throws Exception;
    void pushNotificationToDevice(String homeIp, String warningMessage) throws Exception;

}

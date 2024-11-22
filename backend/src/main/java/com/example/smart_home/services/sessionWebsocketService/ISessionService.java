package com.example.smart_home.services.sessionWebsocketService;

import org.springframework.web.socket.WebSocketSession;

import java.util.Set;

public interface ISessionService {
    void addSessionToTokenGroup(String token, WebSocketSession session);

    void removeSessionFromTokenGroup(WebSocketSession session);

    String findTokenForSession(WebSocketSession session);

    Set<WebSocketSession> getSessionsForToken(String token);
}

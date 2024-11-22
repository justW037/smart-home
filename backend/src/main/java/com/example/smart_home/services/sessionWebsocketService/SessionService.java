package com.example.smart_home.services.sessionWebsocketService;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;


@Service
public class SessionService implements ISessionService{
     private Map<String, Set<WebSocketSession>> tokenSessionsMap = Collections.synchronizedMap(new HashMap<>());

    public void addSessionToTokenGroup(String token, WebSocketSession session) {
        tokenSessionsMap.putIfAbsent(token, Collections.synchronizedSet(new HashSet<>()));
        tokenSessionsMap.get(token).add(session);
        System.out.println("Client " + session.getId() + " added to token group: " + token);
    }

    public void removeSessionFromTokenGroup(WebSocketSession session) {
        for (String token : tokenSessionsMap.keySet()) {
            Set<WebSocketSession> sessions = tokenSessionsMap.get(token);
            if (sessions.remove(session)) {
                if (sessions.isEmpty()) {
                    tokenSessionsMap.remove(token);
                }
                System.out.println("Client " + session.getId() + " removed from token group: " + token);
                break;
            }
        }
    }

    public String findTokenForSession(WebSocketSession session) {
        for (Map.Entry<String, Set<WebSocketSession>> entry : tokenSessionsMap.entrySet()) {
            if (entry.getValue().contains(session)) {
                return entry.getKey();
            }
        }
        return null;
    }

    public Set<WebSocketSession> getSessionsForToken(String token) {
        return tokenSessionsMap.get(token);
    }
}

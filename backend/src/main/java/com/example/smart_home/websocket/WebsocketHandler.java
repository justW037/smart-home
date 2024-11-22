package com.example.smart_home.websocket;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.example.smart_home.services.broadcastWebsocketService.BroadcastService;
import com.example.smart_home.services.broadcastWebsocketService.IBroadcastService;
import com.example.smart_home.services.notificationToken.INoTificationTokenService;
import com.example.smart_home.services.notificationToken.NotificationTokenService;
import com.example.smart_home.services.sessionWebsocketService.ISessionService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class WebsocketHandler extends TextWebSocketHandler {


    private final ISessionService sessionService; 
    private final IBroadcastService broadcastService; 
    // private final INoTificationTokenService notificationTokenService;

    // public WebsocketHandler(ISessionService sessionService, IBroadcastService broadcastService) {
    //     this.sessionService = sessionService;
    //     this.broadcastService = broadcastService;
    // }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Client connected: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String msg = message.getPayload();
        System.out.println("Received from client " + session.getId() + ": " + msg);
        String token = null;
        if (msg.startsWith("token:")) {
            token = msg.split(":")[1].trim();
            sessionService.addSessionToTokenGroup(token, session);
	    return;
        } else {
            token = sessionService.findTokenForSession(session);
        }
    
        if (token == null) {
            System.out.println("Token not found for session " + session.getId());
            return;
        }
        if (msg.startsWith("Warning:")) {
            String warningMessage = msg.split(":", 2)[1].trim();
            broadcastService.pushNotificationToDevice(token, warningMessage);
        } else {
            Set<WebSocketSession> sessions = sessionService.getSessionsForToken(token);
            broadcastService.broadcastMessage(token, session, msg, sessions);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessionService.removeSessionFromTokenGroup(session);
        System.out.println("Client disconnected: " + session.getId());
    }

}
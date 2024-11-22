package com.example.smart_home.configurations;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.example.smart_home.services.broadcastWebsocketService.IBroadcastService;
import com.example.smart_home.services.notificationToken.INoTificationTokenService;
import com.example.smart_home.services.sessionWebsocketService.ISessionService;
import com.example.smart_home.services.sessionWebsocketService.SessionService;
import com.example.smart_home.websocket.WebsocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final INoTificationTokenService notificationTokenService;
    private final ISessionService sessionService; 
     private final IBroadcastService broadcastService; 

    public WebSocketConfig(INoTificationTokenService notificationTokenService,  SessionService sessionService, IBroadcastService broadcastService) {
        this.notificationTokenService = notificationTokenService;
        this.sessionService = sessionService;
        this.broadcastService = broadcastService;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        WebsocketHandler websocketHandler = new WebsocketHandler(sessionService, broadcastService);
        registry.addHandler(websocketHandler, "/api/v1/ws")
                .setAllowedOrigins("*"); 
    }
}
package com.example.smart_home.services.notificationToken;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.example.smart_home.DTOs.notificationTokenDTO.NotificationTokenAddDTO;
import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.exceptions.PermissionDenyException;
import com.example.smart_home.models.Home;
import com.example.smart_home.models.NotificationToken;
import com.example.smart_home.repositories.HomeRepository;
import com.example.smart_home.repositories.NotificationTokenRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NotificationTokenService implements INoTificationTokenService{
    private final JwtTokenUtil jwtTokenUtil;
    private final NotificationTokenRepository notificationTokenRepository;
    private final HomeRepository homeRepository;
    
    @Override
    public List<String> findAllByHomeId(Long homeId) throws Exception {
        homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found"));

        return notificationTokenRepository.findAllByHomeIdAndIsActiveTrue(homeId);
    }

    @Override
    public void addNotificationToken(String token, NotificationTokenAddDTO notificationTokenAddDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Long homeId = notificationTokenAddDTO.getHomeId();
        Home home = homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found"));

        if(home.getUser().getId() != jwtTokenUtil.extractUserId(token)){
             throw new PermissionDenyException("Can't add new notification token , user's id not match");
        }

        NotificationToken existedNotificationToken = notificationTokenRepository.findByToken(notificationTokenAddDTO.getNotificationToken())
        .orElseGet(() -> {
            NotificationToken newNotificationToken = NotificationToken.builder()
                .token(notificationTokenAddDTO.getNotificationToken())
                .home(home)
                .isActive(true)
                .build();
            return notificationTokenRepository.save(newNotificationToken);
        });

        if(!existedNotificationToken.getIsActive()){
            existedNotificationToken.setIsActive(true);
            existedNotificationToken.setExpirationDate(null);
            notificationTokenRepository.save(existedNotificationToken);
        }
    }
    
    @Override
    public void inactiveNotificationToken(String token, String notificationTokenInactive) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        NotificationToken notificationToken = notificationTokenRepository.findByToken(notificationTokenInactive)
            .orElseThrow(() -> new DataNotFoundException("Notification token not found"));

        if(notificationToken.getHome().getUser().getId() != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't inactive notification token , user's id not match");
        }

        if(!notificationToken.getIsActive()){
            throw new DataNotFoundException("Notification token is inactive");
        }

        notificationToken.setIsActive(false);
        notificationToken.setExpirationDate(LocalDateTime.now().plusDays(30));
        notificationTokenRepository.save(notificationToken);
    }
}

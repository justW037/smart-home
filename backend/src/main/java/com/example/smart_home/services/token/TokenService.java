package com.example.smart_home.services.token;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.models.Token;
import com.example.smart_home.models.User;
import com.example.smart_home.repositories.TokenRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TokenService implements ITokenService{

    // @Value("${jwt.expiration}")
    // private int expiration;

    @Value("${jwt.expiration-refresh-token}")
    private int expirationRefreshToken;

    private final TokenRepository tokenRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public Token refreshToken(User user) {
        List<Token> refreshToken = tokenRepository.findByUser(user);
    
        Token validRefreshToken = refreshToken.stream()
                .filter(t -> !t.isRevoked() && !t.isExpired() && t.getExpirationDate().isAfter(LocalDateTime.now()))
                .findFirst()
                .orElse(null);
    
        if (validRefreshToken != null) {
            return validRefreshToken;
        }
        long expirationInSeconds = expirationRefreshToken;
        LocalDateTime expirationDateTime = LocalDateTime.now().plusSeconds(expirationInSeconds);
        Token newRefreshToken  = Token.builder()
                .user(user)
                .revoked(false)
                .expired(false)
                .tokenType("Bearer")
                .expirationDate(expirationDateTime)
                .refreshToken(UUID.randomUUID().toString())
                .build();
    
            tokenRepository.save(newRefreshToken );
            return newRefreshToken;
    }
       
    public String getNewToken(String refreshToken, User user) throws Exception{
        Token existingRefreshToken = tokenRepository.findByRefreshToken(refreshToken);
        if(existingRefreshToken == null) {
            throw new DataNotFoundException("Refresh token does not exist");
        }
        if(existingRefreshToken.getExpirationDate().compareTo(LocalDateTime.now()) < 0){
            tokenRepository.delete(existingRefreshToken);
            throw new ExpiredTokenException("Refresh token is expired");
        }

        String token = jwtTokenUtil.generateToken(user);
        return token;
    }
    
}
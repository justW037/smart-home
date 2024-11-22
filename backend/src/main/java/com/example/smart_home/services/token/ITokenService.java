package com.example.smart_home.services.token;

import com.example.smart_home.models.Token;
import com.example.smart_home.models.User;

public interface ITokenService {
    Token refreshToken(User user);
    // String getNewToken(String refreshToken, User user) throws Exception;
}


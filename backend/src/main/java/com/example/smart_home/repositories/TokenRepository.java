package com.example.smart_home.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.smart_home.models.Token;
import com.example.smart_home.models.User;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findByUser(User user);
    Token findByRefreshToken(String token);
}

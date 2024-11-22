package com.example.smart_home.repositories;

import java.util.Optional;
import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import com.example.smart_home.models.NotificationToken;


public interface NotificationTokenRepository extends JpaRepository<NotificationToken, Long>{
    @Query("SELECT nt.token FROM NotificationToken nt WHERE nt.home.id = :homeId AND nt.isActive = true")
    List<String> findAllByHomeIdAndIsActiveTrue(Long homeId);
    Optional<NotificationToken> findByToken(String token);
}

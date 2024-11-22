package com.example.smart_home.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.smart_home.models.Home;

public interface HomeRepository extends JpaRepository<Home, Long>{
    @Query("SELECT h FROM Home h WHERE h.user.id = :userId AND (:keyword IS NULL OR :keyword = '' OR h.name LIKE %:keyword%)")
    Page<Home> findAllByUserIdAndKeyword(@Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);
    Optional<Home> findByIp(String ip);
}
    

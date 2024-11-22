package com.example.smart_home.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smart_home.models.Type;

public interface TypeRepository extends JpaRepository<Type, Long> {
    
}

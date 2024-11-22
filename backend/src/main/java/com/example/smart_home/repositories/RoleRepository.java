package com.example.smart_home.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.smart_home.models.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{
    
}
package com.example.smart_home.services.home;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.smart_home.DTOs.homeDTO.HomeAddDTO;
import com.example.smart_home.DTOs.homeDTO.HomeUpdateDTO;
import com.example.smart_home.models.Home;

public interface IHomeService {
    Page<Home> findAllByUserId(String token, String keyword, Pageable pageable)throws Exception;
    Home addHome(String token, HomeAddDTO homeAddDTO) throws Exception;
    Home updateHome (String token, HomeUpdateDTO HomeUpdateDTO) throws Exception;
    void deleteHome(String token, Long homeId) throws Exception;
}

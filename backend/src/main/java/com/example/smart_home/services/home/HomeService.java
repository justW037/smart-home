package com.example.smart_home.services.home;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.smart_home.DTOs.homeDTO.HomeAddDTO;
import com.example.smart_home.DTOs.homeDTO.HomeUpdateDTO;
import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.exceptions.PermissionDenyException;
import com.example.smart_home.models.Home;
import com.example.smart_home.models.User;
import com.example.smart_home.repositories.HomeRepository;
import com.example.smart_home.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HomeService implements IHomeService{
    private final UserRepository userRepository;
    private final HomeRepository homeRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public Page<Home> findAllByUserId(String token, String keyword, Pageable pageable) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Long userId = jwtTokenUtil.extractUserId(token);
        return homeRepository.findAllByUserIdAndKeyword(userId, keyword, pageable);
    }

    @Override
    public Home addHome(String token, HomeAddDTO homeAddDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Long userId = homeAddDTO.getUserId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't add new home , user's id not match");
        }
        User user = userRepository.findById(userId).orElseThrow(()-> new DataNotFoundException("User not found"));

        String ipToken;
        boolean tokenExists;
    
        do {
            ipToken = UUID.randomUUID().toString();
            tokenExists = homeRepository.findByIp(ipToken).isPresent();
        } while (tokenExists);

        Home newHome = Home.builder()
            .name(homeAddDTO.getName())
            .user(user)
            .ip(ipToken)
            .build();

        return homeRepository.save(newHome);
    }

    @Override
    public Home updateHome(String token, HomeUpdateDTO homeUpdateDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Long userId = jwtTokenUtil.extractUserId(token);
        Home home = homeRepository.findById(homeUpdateDTO.getId()).orElseThrow(()-> new DataNotFoundException("Home not found"));

        if(home.getUser().getId() != userId){
            throw new ExpiredTokenException("Can't update home , id not match");
        }

        home.setName(homeUpdateDTO.getName());
        return homeRepository.save(home);
    }

    @Override
    public void deleteHome(String token, Long homeId) throws Exception {

        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Long userId = jwtTokenUtil.extractUserId(token);
        Home home = homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found"));

        if(home.getUser().getId() != userId){
            throw new ExpiredTokenException("Can't delete home , id not match");
        }

        homeRepository.delete(home);
    }

    
}

package com.example.smart_home.services.type;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.models.Type;
import com.example.smart_home.repositories.TypeRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TypeService implements ITypeService{
    private final TypeRepository typeRepository;
    private final JwtTokenUtil jwtTokenUtil;
    
    @Override
    public Page<Type> getAllType(String token, Pageable pageable) throws Exception {
         if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        return typeRepository.findAll(pageable);
    }
}

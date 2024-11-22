package com.example.smart_home.services.type;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.smart_home.models.Type;

public interface ITypeService {
    Page<Type> getAllType(String token, Pageable pageable) throws Exception;
}

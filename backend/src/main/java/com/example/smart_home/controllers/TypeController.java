package com.example.smart_home.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_home.models.Type;
import com.example.smart_home.responses.typeResponse.TypeListResponse;
import com.example.smart_home.responses.typeResponse.TypeResponse;
import com.example.smart_home.services.type.ITypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/types")
@RequiredArgsConstructor
public class TypeController {
    private final ITypeService typeService;

    @GetMapping("/")
    public ResponseEntity<?> getAllType(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int limit, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").ascending());
            String extractedToken = authorizationHeader.substring(7);
            Page<Type> typePage = typeService.getAllType(extractedToken, pageRequest);
            int totalPages = typePage.getTotalPages();

            List<TypeResponse> typeResponses = typePage.getContent()
                    .stream()
                    .map(type -> new TypeResponse(type.getId(), type.getName()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    TypeListResponse.builder()
                            .message("Get all type successfully")
                            .typeResponse(typeResponses)
                            .totalPages(totalPages)
                            .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(TypeListResponse.builder().message(e.getMessage()).build());
        }
    }
}

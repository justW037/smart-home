package com.example.smart_home.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_home.DTOs.homeDTO.HomeAddDTO;
import com.example.smart_home.DTOs.homeDTO.HomeUpdateDTO;
import com.example.smart_home.models.Home;
import com.example.smart_home.responses.homeResponse.AddHomeResponse;
import com.example.smart_home.responses.homeResponse.DeleteHomeResponse;
import com.example.smart_home.responses.homeResponse.HomeListResponse;
import com.example.smart_home.responses.homeResponse.HomeResponse;
import com.example.smart_home.responses.homeResponse.UpdateHomeResponse;
import com.example.smart_home.services.home.IHomeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@RestController
@RequestMapping("${api.prefix}/homes")
@RequiredArgsConstructor
public class HomeController {
    private final IHomeService homeService;
    
    @PostMapping("/add-home")
    public ResponseEntity<AddHomeResponse> addHome(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody HomeAddDTO homeAddDTO, BindingResult result) {
        AddHomeResponse addHomeResponse = new AddHomeResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

            addHomeResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(addHomeResponse);
        }
        try {
            String extractedToken = authorizationHeader.substring(7);
            Home home = homeService.addHome(extractedToken, homeAddDTO);
            HomeResponse homeResponse = HomeResponse.builder()
            .id(home.getId())
            .name(home.getName())
            .userId(home.getUser().getId())
            .homeIp(home.getIp())
            .build();


            addHomeResponse.setMessage("Home added successfully");
            addHomeResponse.setHome(homeResponse);
            return ResponseEntity.ok(addHomeResponse);
        } catch (Exception e) {
            addHomeResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(addHomeResponse);
        }
    }
    
    @PutMapping("/update-home")
    public ResponseEntity<UpdateHomeResponse> updateHome(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody HomeUpdateDTO homeUpdateDTO, BindingResult result) {
        UpdateHomeResponse updateHomeResponse = new UpdateHomeResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

                updateHomeResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(updateHomeResponse);
        }
        try {
            String extractedToken = authorizationHeader.substring(7);

            Home home = homeService.updateHome(extractedToken, homeUpdateDTO);
            HomeResponse homeResponse = HomeResponse.builder()
            .id(home.getId())
            .name(home.getName())
            .userId(home.getUser().getId())
            .homeIp(home.getIp())
            .build();

            updateHomeResponse.setMessage("Home updated successfully");
            updateHomeResponse.setHome(homeResponse);

            return ResponseEntity.ok(updateHomeResponse);
        } catch (Exception e) {
            updateHomeResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(updateHomeResponse);
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getAllHome(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestHeader("Authorization") String authorizationHeader) {
            
        try {
            PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").ascending());

            String extractedToken = authorizationHeader.substring(7);

            Page<Home> homePage = homeService.findAllByUserId(extractedToken, keyword, pageRequest);

            int totalPages = homePage.getTotalPages();

            List<HomeResponse> homeResponses = homePage.getContent()
            .stream()
            .map(home -> new HomeResponse(home.getId(), home.getName(), home.getUser().getId(), home.getIp()))
            .collect(Collectors.toList());

            return ResponseEntity.ok(HomeListResponse.builder()
                    .message("Get home list successfully")
                    .homeList(homeResponses)
                    .totalPages(totalPages)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(HomeListResponse.builder().message(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHome(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long id) {
        DeleteHomeResponse homeResponse = new DeleteHomeResponse();
        try {
            String extractedToken = authorizationHeader.substring(7);
            homeService.deleteHome(extractedToken, id);
            homeResponse.setMessage("Home deleted successfully");
            homeResponse.setHomeId(id);
            return ResponseEntity.ok(homeResponse);
        } catch (Exception e) {
            homeResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(homeResponse);
        }
    }
}

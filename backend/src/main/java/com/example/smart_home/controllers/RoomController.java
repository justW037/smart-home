package com.example.smart_home.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_home.DTOs.roomDTO.RoomAddDTO;
import com.example.smart_home.DTOs.roomDTO.RoomUpdateDTO;
import com.example.smart_home.models.Room;
import com.example.smart_home.responses.roomReponse.AddRoomResponse;
import com.example.smart_home.responses.roomReponse.DeleteRoomResponse;
import com.example.smart_home.responses.roomReponse.RoomListResponse;
import com.example.smart_home.responses.roomReponse.RoomResponse;
import com.example.smart_home.responses.roomReponse.UpdateRoomResponse;
import com.example.smart_home.services.room.IRoomService;

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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("${api.prefix}/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final IRoomService roomService;

    @GetMapping("/get-all/{homeId}")
    public ResponseEntity<?> getAllRoomByHomeId(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long homeId) {

        try {
            PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").ascending());

            String extractedToken = authorizationHeader.substring(7);

            Page<Room> roomPage = roomService.findAllByHomeId(extractedToken, homeId, keyword, pageRequest);
            int totalPages = roomPage.getTotalPages();

            List<RoomResponse> roomResponses = roomPage.getContent()
            .stream()
            .map(room -> new RoomResponse(room.getId(), room.getName(), room.getHome().getId()))
            .collect(Collectors.toList());

            return ResponseEntity.ok(RoomListResponse.builder()
                    .message("Get home list successfully")
                    .roomList(roomResponses)
                    .totalPages(totalPages)
                    .build());
        } catch (Exception e) {
           return ResponseEntity.badRequest().body(RoomListResponse.builder().message(e.getMessage()).build());
        }
        
    }
    
    @PostMapping("/add-room")
    public ResponseEntity<AddRoomResponse> addHome(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody RoomAddDTO roomAddDTO, BindingResult result) {
        AddRoomResponse addRoomResponse = new AddRoomResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

            addRoomResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(addRoomResponse);
        }
        try {
            String extractedToken = authorizationHeader.substring(7);
            Room room = roomService.addRoom(extractedToken, roomAddDTO);
            RoomResponse roomResponse = RoomResponse.builder()
            .id(room.getId())
            .name(room.getName())
            .homeId(room.getHome().getId())
            .build();

            addRoomResponse.setMessage("Room added successfully");
            addRoomResponse.setRoom(roomResponse);
            return ResponseEntity.ok(addRoomResponse);
        } catch (Exception e) {
            addRoomResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(addRoomResponse);
        }
    }
    
    @PutMapping("/update-room")
    public ResponseEntity<UpdateRoomResponse> updateHome(@RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody RoomUpdateDTO roomUpdateDTO, BindingResult result) {
        UpdateRoomResponse updateRoomResponse = new UpdateRoomResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

                updateRoomResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(updateRoomResponse);
        }

        try {
            String extractedToken = authorizationHeader.substring(7);
            Room room = roomService.updateRoom(extractedToken, roomUpdateDTO);
            RoomResponse roomResponse = RoomResponse.builder()
            .id(room.getId())
            .name(room.getName())
            .homeId(room.getHome().getId())
            .build();

            updateRoomResponse.setMessage("Room updated successfully");
            updateRoomResponse.setRoom(roomResponse);
            return ResponseEntity.ok(updateRoomResponse);
        } catch (Exception e) {
            updateRoomResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(updateRoomResponse);
        }
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long id) {
        DeleteRoomResponse deleteRoomResponse = new DeleteRoomResponse();
        try {
            String extractedToken = authorizationHeader.substring(7);
            roomService.deleteRoom(extractedToken, id);
            deleteRoomResponse.setMessage("Room deleted successfully");
            deleteRoomResponse.setRoomId(id);
            return ResponseEntity.ok(deleteRoomResponse);
        } catch (Exception e) {
            deleteRoomResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(deleteRoomResponse);
        }
    }
}

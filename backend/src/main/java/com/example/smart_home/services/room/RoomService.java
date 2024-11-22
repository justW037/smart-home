package com.example.smart_home.services.room;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.smart_home.DTOs.roomDTO.RoomAddDTO;
import com.example.smart_home.DTOs.roomDTO.RoomUpdateDTO;
import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.exceptions.PermissionDenyException;
import com.example.smart_home.models.Home;
import com.example.smart_home.models.Room;
import com.example.smart_home.repositories.HomeRepository;
import com.example.smart_home.repositories.RoomRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class RoomService implements IRoomService{
    private final JwtTokenUtil jwtTokenUtil;
    private final RoomRepository roomRepository;
    private final HomeRepository homeRepository;

    @Override
    public Page<Room> findAllByHomeId(String token , Long homeId, String keyword, Pageable pageable) throws Exception {

        Home home = homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found"));
        Long userId = home.getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't find room ,user's id not match");
        }

        return roomRepository.findByHomeId(homeId ,keyword, pageable);
    }

    @Override
    public Room addRoom(String token, RoomAddDTO roomAddDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Home home = homeRepository.findById(roomAddDTO.getHomeId()).orElseThrow(()-> new DataNotFoundException("Home not found"));

        Long userId = home.getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't add new room ,user's id not match");
        }
        if(roomRepository.uniqueNameCheck(roomAddDTO.getName())){
            throw new DataNotFoundException("Room name is already exist");
        }

        Room newRoom = Room.builder()
            .name(roomAddDTO.getName())
            .home(home)
            .build();

        return roomRepository.save(newRoom);
    }

    @Override
    public Room updateRoom(String token, RoomUpdateDTO roomUpdateDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Room room = roomRepository.findById(roomUpdateDTO.getId()).orElseThrow(()-> new DataNotFoundException("Room not found"));

        Home home = homeRepository.findById(room.getHome().getId()).orElseThrow(()-> new DataNotFoundException("Hoom not found"));

        Long userId = home.getUser().getId();

        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't update room ,user's id not match");
        }
        if(roomRepository.uniqueNameCheck(roomUpdateDTO.getName())){
            throw new DataNotFoundException("Room name is already exist");
        }
        room.setName(roomUpdateDTO.getName());
        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(String token, Long roomId)throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Room room = roomRepository.findById(roomId).orElseThrow(()-> new DataNotFoundException("Room not found"));
        Long userId = room.getHome().getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't delete room ,user's id not match");
        }
        roomRepository.delete(room);
    }
}

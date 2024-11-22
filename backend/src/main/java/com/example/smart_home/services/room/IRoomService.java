package com.example.smart_home.services.room;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.smart_home.DTOs.roomDTO.RoomAddDTO;
import com.example.smart_home.DTOs.roomDTO.RoomUpdateDTO;
import com.example.smart_home.models.Room;

public interface IRoomService {
    Page<Room> findAllByHomeId(String token, Long homeId,String keyword, Pageable pageable)throws Exception;
    Room addRoom(String token, RoomAddDTO roomAddDTO) throws Exception;
    Room updateRoom(String token, RoomUpdateDTO roomUpdateDTO) throws Exception;
    void deleteRoom(String token, Long roomId) throws Exception;
}

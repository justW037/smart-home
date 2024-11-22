package com.example.smart_home.services.device;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.smart_home.DTOs.deviceDTO.DeviceAddDTO;
import com.example.smart_home.DTOs.deviceDTO.DeviceUpdateDTO;
import com.example.smart_home.components.JwtTokenUtil;
import com.example.smart_home.exceptions.DataNotFoundException;
import com.example.smart_home.exceptions.ExpiredTokenException;
import com.example.smart_home.exceptions.PermissionDenyException;
import com.example.smart_home.models.Device;
import com.example.smart_home.models.Room;
import com.example.smart_home.models.Type;
import com.example.smart_home.repositories.DeviceRepository;
import com.example.smart_home.repositories.HomeRepository;
import com.example.smart_home.repositories.RoomRepository;
import com.example.smart_home.repositories.TypeRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DeviceService implements IDeviceService {
    private final RoomRepository roomRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final DeviceRepository deviceRepository;
    private final TypeRepository typeRepository;
    private final HomeRepository homeRepository;
    
    @Override
    public Page<Device> findAllByRoomId( String token, Long roomId, String keyword, Pageable pageable) throws Exception {
        Room room = roomRepository.findById(roomId).orElseThrow(()-> new DataNotFoundException("Room not found"));
        Long userId = room.getHome().getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't add new room ,user's id not match");
        }
        return deviceRepository.findByRoomId(roomId, keyword, pageable);
    }

    @Override
    public Device addDevice(String token, DeviceAddDTO deviceAddDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Room room = roomRepository.findById(deviceAddDTO.getRoomId()).orElseThrow(()-> new DataNotFoundException("Room not found"));

        Type type = typeRepository.findById(deviceAddDTO.getTypeId()).orElseThrow(()-> new DataNotFoundException("Type not found"));

        Long userId = room.getHome().getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't add new device  ,user's id not match");
        }

        Device newDevice = Device.builder()
            .name(deviceAddDTO.getName())
            .room(room)
            .type(type)
            .port(deviceAddDTO.getPort())
            .build();
        return deviceRepository.save(newDevice);
    }

    @Override
    public Device updateDevice(String token, DeviceUpdateDTO deviceUpdateDTO) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Device device = deviceRepository.findById(deviceUpdateDTO.getId()).orElseThrow(()-> new DataNotFoundException("Device not found"));

        Type type = typeRepository.findById(deviceUpdateDTO.getTypeId()).orElseThrow(()-> new DataNotFoundException("Type not found"));


        Long userId = device.getRoom().getHome().getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't update device ,user's id not match");
        }
        Room room = roomRepository.findById(deviceUpdateDTO.getRoomId()).orElseThrow(()-> new DataNotFoundException("Room not found"));

        device.setName(deviceUpdateDTO.getName());
        device.setType(type);
        device.setRoom(room);
        device.setPort(deviceUpdateDTO.getPort());
        return deviceRepository.save(device);
    }

    @Override
    public void deleteDevice(String token, Long deviceId) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Device device = deviceRepository.findById(deviceId).orElseThrow(()-> new DataNotFoundException("Device not found"));
        Long userId = device.getRoom().getHome().getUser().getId();
        if(userId != jwtTokenUtil.extractUserId(token)){
            throw new PermissionDenyException("Can't delete device ,user's id not match");
        }
        deviceRepository.deleteById(deviceId);
    }

    @Override
    public List<Device> findByName(String token , String deviceName, Long roomId, Long typeId, Long homeId) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Long userId = homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found")).getUser().getId();

        if(userId != jwtTokenUtil.extractUserId(token)) {
            throw new PermissionDenyException("Can't search device ,user's id not match");
        }
         
        return deviceRepository.findByNameAndRoomIdAndTypeIdAndHomeId(deviceName, roomId, typeId, homeId);
    }

    @Override
    public Device getDeviceById(String token, Long deviceId ) throws Exception{
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        Device device = deviceRepository.findById(deviceId).orElseThrow(()-> new DataNotFoundException("Device not found"));
        return device;
    }

    @Override
    public Device getDeviceByNameAndRoomName(String token, String deviceName, String roomName, Long homeId) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Long userId = homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found")).getUser().getId();

        if(userId != jwtTokenUtil.extractUserId(token)) {
            throw new PermissionDenyException("Can't search device ,user's id not match");
        }

        Device device = deviceRepository.findByNameAndRoomName(deviceName, roomName, homeId).orElseThrow(()-> new DataNotFoundException("Device not found"));
        return device;
    }

    @Override
    public List<Device> findAllByTypeId(String token, Long typeId, String roomName, Long homeId) throws Exception {
        if(jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }

        Long userId = homeRepository.findById(homeId).orElseThrow(()-> new DataNotFoundException("Home not found")).getUser().getId();

        if(userId != jwtTokenUtil.extractUserId(token)) {
            throw new PermissionDenyException("Can't search device ,user's id not match");
        }

        return deviceRepository.findByTypeId(typeId, homeId, roomName);
    }
    
}


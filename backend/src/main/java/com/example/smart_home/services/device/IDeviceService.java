package com.example.smart_home.services.device;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.smart_home.DTOs.deviceDTO.DeviceAddDTO;
import com.example.smart_home.DTOs.deviceDTO.DeviceUpdateDTO;
import com.example.smart_home.models.Device;

public interface IDeviceService {
    Page<Device> findAllByRoomId(String token, Long roomId, String keyword, Pageable pageable) throws Exception;
    Device addDevice(String token, DeviceAddDTO  deviceAddDTO) throws Exception;
    Device updateDevice(String token, DeviceUpdateDTO  deviceUpdateDTO) throws Exception;
    void deleteDevice(String token, Long deviceId) throws Exception;
    List<Device> findByName(String token , String deviceName, Long roomId, Long typeId, Long homeId) throws Exception;
    Device getDeviceById(String token, Long deviceId ) throws Exception;
    Device getDeviceByNameAndRoomName(String token, String deviceName, String roomName, Long homeId) throws Exception;
    List<Device> findAllByTypeId(String token, Long typeId, String roomName, Long homeId) throws Exception;
}

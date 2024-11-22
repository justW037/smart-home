package com.example.smart_home.controllers;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.smart_home.DTOs.deviceDTO.DeviceAddDTO;
import com.example.smart_home.DTOs.deviceDTO.DeviceUpdateDTO;
import com.example.smart_home.models.Device;
import com.example.smart_home.responses.deviceResponse.AddDeviceResponse;
import com.example.smart_home.responses.deviceResponse.DeleteDeviceResponse;
import com.example.smart_home.responses.deviceResponse.DeviceListResponse;
import com.example.smart_home.responses.deviceResponse.DeviceResponse;
import com.example.smart_home.responses.deviceResponse.SearchDeviceResponse;
import com.example.smart_home.responses.deviceResponse.UpdateDeviceResponse;
import com.example.smart_home.services.device.IDeviceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("${api.prefix}/devices")
@RequiredArgsConstructor
public class DeviceController {
    private final IDeviceService deviceService;

    @GetMapping("/get-all/{roomId}")
    public ResponseEntity<?> getAllDeviceByRoomId(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Long roomId) {

        try {
            PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").ascending());

            String extractedToken = authorizationHeader.substring(7);

            Page<Device> devicePage = deviceService.findAllByRoomId(extractedToken, roomId, keyword, pageRequest);
            int totalPages = devicePage.getTotalPages();

            List<DeviceResponse> deviceResponses = devicePage.getContent()
            .stream()
            .map(device -> new DeviceResponse(device.getId(), device.getName(), device.getType().getId() ,device.getRoom().getId(), device.getPort()))
            .collect(Collectors.toList());

            return ResponseEntity.ok(DeviceListResponse.builder()
                    .message("Get device list successfully")
                    .deviceList(deviceResponses)
                    .totalPages(totalPages)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(DeviceListResponse.builder().message(e.getMessage()).build());
        }
    }

    @PostMapping("/add-device")
    public ResponseEntity<AddDeviceResponse> addDevice( @RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody DeviceAddDTO deviceAddDTO, BindingResult result) {
        AddDeviceResponse addDeviceResponse = new AddDeviceResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

            addDeviceResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(addDeviceResponse);
        }
        try {
            String extractedToken = authorizationHeader.substring(7);
            Device device = deviceService.addDevice(extractedToken, deviceAddDTO);
            DeviceResponse deviceResponse = DeviceResponse.builder()
            .id(device.getId())
            .name(device.getName())
            .typeId(device.getType().getId())
            .roomId(device.getRoom().getId())
            .port(device.getPort())
            .build();
            addDeviceResponse.setMessage("Device added successfully");
            addDeviceResponse.setDevice(deviceResponse);
            return ResponseEntity.ok(addDeviceResponse);
        } catch (Exception e) {
            addDeviceResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(addDeviceResponse);
        }
    }

    @PutMapping("/update-device")
    public ResponseEntity<UpdateDeviceResponse> updateDevice( @RequestHeader("Authorization") String authorizationHeader, @Valid @RequestBody DeviceUpdateDTO deviceUpdateDTO, BindingResult result) {
        UpdateDeviceResponse updateDeviceResponse = new UpdateDeviceResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

            updateDeviceResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(updateDeviceResponse);
        }
        try {
            String extractedToken = authorizationHeader.substring(7);
            Device device = deviceService.updateDevice(extractedToken, deviceUpdateDTO);
            DeviceResponse deviceResponse = DeviceResponse.builder()
            .id(device.getId())
            .name(device.getName())
            .typeId(device.getType().getId())
            .roomId(device.getRoom().getId())
            .port(device.getPort())
            .build();
            updateDeviceResponse.setMessage("Device updated successfully");
            updateDeviceResponse.setDevice(deviceResponse);
            return ResponseEntity.ok(updateDeviceResponse);
        } catch (Exception e) {
            updateDeviceResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(updateDeviceResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDevice(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long id) {
        DeleteDeviceResponse deleteDeviceResponse = new DeleteDeviceResponse();
        try {
            String extractedToken = authorizationHeader.substring(7);
            deviceService.deleteDevice(extractedToken, id);
            deleteDeviceResponse.setMessage("Device deleted successfully");
            deleteDeviceResponse.setDeviceId(id);
            return ResponseEntity.ok(deleteDeviceResponse);
        } catch (Exception e) {
            deleteDeviceResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(deleteDeviceResponse);
        }
    }

    @GetMapping("/search/{deviceName}")
    public ResponseEntity<?> findDevice(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable("deviceName") String deviceName,
        @RequestParam(value = "roomId", required = false) Long roomId,
        @RequestParam(value = "typeId", required = false) Long typeId,
        @RequestParam(value = "homeId") Long homeId
    ) {
        try {
            String token = authorizationHeader.substring(7);

            List<Device> devices = deviceService.findByName(token, deviceName, roomId, typeId, homeId);

            List<SearchDeviceResponse> deviceResponses = devices.stream()
            .map(device -> new SearchDeviceResponse(
                device.getId(),
                device.getName(),
                device.getType().getName(),
                device.getRoom().getName()
            ))
            .collect(Collectors.toList());
            return ResponseEntity.ok(deviceResponses);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(DeviceListResponse.builder().message(e.getMessage()).build());
        }
    }

    @GetMapping("/{deviceId}")
    public ResponseEntity<?> getDeviceById(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long deviceId) {
        try {
            String token = authorizationHeader.substring(7);
            Device device = deviceService.getDeviceById(token, deviceId);
            DeviceResponse deviceResponse = DeviceResponse.builder()
            .id(device.getId())
            .name(device.getName())
            .typeId(device.getType().getId())
            .roomId(device.getRoom().getId())
            .port(device.getPort())
            .build();
            return ResponseEntity.ok(deviceResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(DeviceListResponse.builder().message(e.getMessage()).build());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> getDeviceByNameAndRoomName(@RequestHeader("Authorization") String authorizationHeader, @RequestParam(value = "deviceName", required = true) String deviceName, @RequestParam(value = "roomName", required = false) String roomName, @RequestParam(value = "homeId") Long homeId) {
        try {
            String token = authorizationHeader.substring(7);
            Device device = deviceService.getDeviceByNameAndRoomName(token, deviceName, roomName, homeId);

            DeviceResponse deviceResponse = DeviceResponse.builder()
            .id(device.getId())
            .name(device.getName())
            .typeId(device.getType().getId())
            .roomId(device.getRoom().getId())
            .port(device.getPort())
            .build();
            return ResponseEntity.ok(deviceResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(DeviceListResponse.builder().message(e.getMessage()).build());
        }
    }

    @GetMapping("/all-by-type")
    public ResponseEntity<?> getAllDevicesByTypeId(@RequestHeader("Authorization") String authorizationHeader, @RequestParam(value = "typeId", required = false) Long typeId, @RequestParam(value = "roomName", required = false) String roomName, @RequestParam(value = "homeId") Long homeId) {
        try {
            String token = authorizationHeader.substring(7);
            List<Device> devices = deviceService.findAllByTypeId(token, typeId, roomName, homeId);

            List<DeviceResponse> deviceResponses = devices.stream()
            .map(device -> new DeviceResponse(
                device.getId(),
                device.getName(),
                device.getType().getId(),
                device.getRoom().getId(),
                device.getPort()
            ))
            .collect(Collectors.toList());
            return ResponseEntity.ok(deviceResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(DeviceListResponse.builder().message(e.getMessage()).build());
        }
    }
}

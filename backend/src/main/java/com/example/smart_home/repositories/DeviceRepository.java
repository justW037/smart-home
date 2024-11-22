package com.example.smart_home.repositories;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.smart_home.models.Device;

public interface DeviceRepository extends JpaRepository<Device, Long>{
    @Query("SELECT d FROM Device d WHERE d.room.id = :roomId AND (:keyword IS NULL OR d.name LIKE %:keyword%)")
    Page<Device> findByRoomId(@Param("roomId") Long roomId, @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT d FROM Device d WHERE d.name LIKE %:name% " +
   "AND (:roomId IS NULL OR d.room.id = :roomId) " +
   "AND (:typeId IS NULL OR d.type.id = :typeId) " +
   "AND (d.room.home.id = :homeId)")
    List<Device> findByNameAndRoomIdAndTypeIdAndHomeId(
        @Param("name") String name, 
        @Param("roomId") Long roomId, 
        @Param("typeId") Long typeId, 
        @Param("homeId") Long homeId);

    @Query("SELECT d FROM Device d WHERE d.name = :name AND (:roomName IS NULL OR d.room.name = :roomName) AND (d.room.home.id = :homeId)") 
    Optional<Device> findByNameAndRoomName(@Param("name") String name, @Param("roomName") String roomName, @Param("homeId") Long homeId);
        

    @Query("SELECT d FROM Device d WHERE (:typeId IS NULL OR d.type.id = :typeId) AND (:roomName IS NULL OR d.room.name = :roomName)  AND (d.room.home.id = :homeId) AND (d.port IS NOT NULL) AND (d.type.name != 'SENSOR')")
    List<Device> findByTypeId(@Param("typeId") Long typeId, @Param("homeId") Long homeId, @Param("roomName") String roomName);
}

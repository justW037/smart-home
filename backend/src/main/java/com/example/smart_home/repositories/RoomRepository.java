package com.example.smart_home.repositories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.smart_home.models.Room;

public interface RoomRepository extends JpaRepository<Room, Long>{
    @Query("SELECT r FROM Room r WHERE r.home.id = :homeId AND (:keyword IS NULL OR r.name LIKE %:keyword%)")
    Page<Room> findByHomeId(@Param("homeId") Long homeId, @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Room r WHERE r.name = :name")
    boolean uniqueNameCheck(String name);

}
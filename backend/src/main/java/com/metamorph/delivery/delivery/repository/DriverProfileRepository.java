package com.metamorph.delivery.delivery.repository;

import com.metamorph.delivery.delivery.entity.DriverProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriverProfileRepository extends JpaRepository<DriverProfile, UUID> {

    Optional<DriverProfile> findByUserId(UUID userId);

    List<DriverProfile> findByIsOnlineTrueAndIsVerifiedTrue();
}

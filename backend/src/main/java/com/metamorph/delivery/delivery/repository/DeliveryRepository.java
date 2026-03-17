package com.metamorph.delivery.delivery.repository;

import com.metamorph.delivery.delivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    Optional<Delivery> findByOrderId(UUID orderId);

    List<Delivery> findByDriverId(UUID driverId);
}

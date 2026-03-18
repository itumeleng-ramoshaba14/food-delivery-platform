package com.metamorph.delivery.order.repository;

import com.metamorph.delivery.order.entity.Order;
import com.metamorph.delivery.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    Optional<Order> findByPublicOrderId(String publicOrderId);

    boolean existsByPublicOrderId(String publicOrderId);

    boolean existsByPublicDeliveryId(String publicDeliveryId);

    Page<Order> findByCustomerIdOrderByPlacedAtDesc(UUID customerId, Pageable pageable);

    Page<Order> findByRestaurantIdOrderByPlacedAtDesc(UUID restaurantId, Pageable pageable);

    Page<Order> findByRestaurantIdAndStatusOrderByPlacedAtDesc(UUID restaurantId, OrderStatus status,
            Pageable pageable);
}
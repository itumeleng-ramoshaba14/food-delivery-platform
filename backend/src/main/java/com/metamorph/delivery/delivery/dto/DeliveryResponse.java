package com.metamorph.delivery.delivery.dto;

import com.metamorph.delivery.delivery.entity.Delivery;
import com.metamorph.delivery.delivery.entity.DeliveryStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DeliveryResponse {

    private UUID id;
    private UUID orderId;
    private String publicOrderId;
    private String publicDeliveryId;
    private UUID driverId;
    private String driverName;
    private DeliveryStatus status;
    private String pickupAddress;
    private String dropoffAddress;
    private BigDecimal distanceKm;
    private Integer estimatedMinutes;
    private Integer actualMinutes;
    private String deliveryOtp;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt;

    public static DeliveryResponse fromEntity(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .orderId(delivery.getOrder() != null ? delivery.getOrder().getId() : null)
                .publicOrderId(delivery.getOrder() != null ? delivery.getOrder().getPublicOrderId() : null)
                .publicDeliveryId(delivery.getOrder() != null ? delivery.getOrder().getPublicDeliveryId() : null)
                .driverId(delivery.getDriver() != null ? delivery.getDriver().getId() : null)
                .driverName(delivery.getDriver() != null
                        ? delivery.getDriver().getFirstName() + " " + delivery.getDriver().getLastName()
                        : null)
                .status(delivery.getStatus())
                .pickupAddress(delivery.getPickupAddress())
                .dropoffAddress(delivery.getDropoffAddress())
                .distanceKm(delivery.getDistanceKm())
                .estimatedMinutes(delivery.getEstimatedMinutes())
                .actualMinutes(delivery.getActualMinutes())
                .deliveryOtp(delivery.getDeliveryOtp())
                .assignedAt(delivery.getAssignedAt())
                .pickedUpAt(delivery.getPickedUpAt())
                .deliveredAt(delivery.getDeliveredAt())
                .createdAt(delivery.getCreatedAt())
                .build();
    }
}
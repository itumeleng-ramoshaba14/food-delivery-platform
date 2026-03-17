package com.metamorph.delivery.delivery.entity;

import com.metamorph.delivery.order.entity.Order;
import com.metamorph.delivery.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "deliveries", indexes = {
        @Index(name = "idx_deliveries_order_id", columnList = "order_id"),
        @Index(name = "idx_deliveries_driver_id", columnList = "driver_id"),
        @Index(name = "idx_deliveries_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private User driver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.PENDING;

    private String pickupAddress;

    private Double pickupLatitude;

    private Double pickupLongitude;

    private String dropoffAddress;

    private Double dropoffLatitude;

    private Double dropoffLongitude;

    @Column(precision = 10, scale = 2)
    private BigDecimal distanceKm;

    private Integer estimatedMinutes;

    private Integer actualMinutes;

    @Column(length = 4)
    private String deliveryOtp;

    private String proofOfDeliveryUrl;

    private LocalDateTime assignedAt;

    private LocalDateTime pickedUpAt;

    private LocalDateTime deliveredAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}

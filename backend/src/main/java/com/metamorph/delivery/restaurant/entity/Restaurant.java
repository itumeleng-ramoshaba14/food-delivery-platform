package com.metamorph.delivery.restaurant.entity;

import com.metamorph.delivery.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "restaurants", indexes = {
        @Index(name = "idx_restaurants_owner_id", columnList = "owner_id"),
        @Index(name = "idx_restaurants_is_active", columnList = "is_active"),
        @Index(name = "idx_restaurants_cuisine_type", columnList = "cuisine_type"),
        @Index(name = "idx_restaurants_city", columnList = "city")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 20)
    private String phone;

    private String email;

    @Column(nullable = false)
    private String addressLine1;

    @Column(nullable = false, length = 100)
    private String city;

    private Double latitude;

    private Double longitude;

    @Column(length = 50)
    private String cuisineType;

    private String logoUrl;

    private String bannerUrl;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;

    @Builder.Default
    private Integer totalRatings = 0;

    @Column(precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal commissionRate = new BigDecimal("15.00");

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal minOrderAmount = BigDecimal.ZERO;

    @Builder.Default
    private Integer avgPrepTimeMinutes = 30;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isOpen = false;

    private LocalTime openingTime;

    private LocalTime closingTime;

    private String bankName;

    private String bankAccountNumber;

    private String bankRoutingCode;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

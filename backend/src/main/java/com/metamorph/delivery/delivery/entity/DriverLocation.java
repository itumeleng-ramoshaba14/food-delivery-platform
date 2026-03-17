package com.metamorph.delivery.delivery.entity;

import com.metamorph.delivery.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "driver_locations", indexes = {
        @Index(name = "idx_driver_locations_driver_timestamp", columnList = "driver_id, timestamp")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    private double bearing;

    @Column(nullable = false)
    private double speed;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}

package com.metamorph.delivery.order.dto;

import com.metamorph.delivery.order.entity.OrderEventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEventResponse {

    private UUID id;
    private OrderEventType eventType;
    private UUID actorId;
    private String details;
    private LocalDateTime createdAt;
}

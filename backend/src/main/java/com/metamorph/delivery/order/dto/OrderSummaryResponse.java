package com.metamorph.delivery.order.dto;

import com.metamorph.delivery.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {

    private UUID id;
    private String restaurantName;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private int itemCount;
    private LocalDateTime placedAt;
}

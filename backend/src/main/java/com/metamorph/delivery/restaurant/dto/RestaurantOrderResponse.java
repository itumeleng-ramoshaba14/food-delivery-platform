package com.metamorph.delivery.restaurant.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class RestaurantOrderResponse {
    private UUID id;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private String customerName;
    private List<RestaurantOrderItemResponse> items;
}
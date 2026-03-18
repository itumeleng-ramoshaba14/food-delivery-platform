package com.metamorph.delivery.restaurant.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RestaurantOrderItemResponse {
    private String name;
    private Integer quantity;
    private BigDecimal unitPrice;
}
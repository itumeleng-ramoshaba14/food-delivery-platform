package com.metamorph.delivery.order.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderRequest {
    private Long restaurantId;
    private List<PlaceOrderItemRequest> items;
}
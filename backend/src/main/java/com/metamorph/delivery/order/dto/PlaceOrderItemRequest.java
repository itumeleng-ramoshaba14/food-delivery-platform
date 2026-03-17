package com.metamorph.delivery.order.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaceOrderItemRequest {
    private UUID menuItemId;
    private Integer quantity;
}
package com.metamorph.delivery.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "Restaurant ID is required")
    private UUID restaurantId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Delivery address ID is required")
    private UUID deliveryAddressId;

    private String deliveryInstructions;

    private LocalDateTime scheduledFor;

    @PositiveOrZero(message = "Tip amount must be zero or positive")
    @Builder.Default
    private BigDecimal tipAmount = BigDecimal.ZERO;

    private String promoCode;
}

package com.metamorph.delivery.delivery.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AssignDriverRequest {

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "Driver user ID is required")
    private UUID driverUserId;
}

package com.metamorph.delivery.order.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptOrderRequest {

    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    private int prepTimeMinutes;
}

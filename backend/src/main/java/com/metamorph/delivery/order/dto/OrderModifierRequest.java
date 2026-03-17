package com.metamorph.delivery.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderModifierRequest {

    @NotNull(message = "Modifier option ID is required")
    private UUID modifierOptionId;
}

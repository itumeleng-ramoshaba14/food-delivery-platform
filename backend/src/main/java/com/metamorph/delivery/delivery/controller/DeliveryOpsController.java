package com.metamorph.delivery.delivery.controller;

import com.metamorph.delivery.common.dto.ApiResponse;
import com.metamorph.delivery.delivery.dto.AssignDriverRequest;
import com.metamorph.delivery.delivery.dto.DeliveryResponse;
import com.metamorph.delivery.delivery.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryOpsController {

    private final DeliveryService deliveryService;

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<DeliveryResponse>> assignDriver(@Valid @RequestBody AssignDriverRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Driver assigned successfully",
                deliveryService.assignDriver(request.getOrderId(), request.getDriverUserId())));
    }
}

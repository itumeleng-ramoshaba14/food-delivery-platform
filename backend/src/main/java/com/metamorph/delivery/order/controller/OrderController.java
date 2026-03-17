package com.metamorph.delivery.order.controller;

import com.metamorph.delivery.common.dto.ApiResponse;
import com.metamorph.delivery.order.dto.OrderResponse;
import com.metamorph.delivery.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{publicOrderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByPublicOrderId(
            @PathVariable String publicOrderId) {

        OrderResponse response = orderService.getOrderByPublicOrderId(publicOrderId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

package com.metamorph.delivery.order.controller;

import com.metamorph.delivery.common.dto.ApiResponse;
import com.metamorph.delivery.order.dto.CancelOrderRequest;
import com.metamorph.delivery.order.dto.OrderResponse;
import com.metamorph.delivery.order.dto.OrderSummaryResponse;
import com.metamorph.delivery.order.dto.CreateOrderRequest;
import com.metamorph.delivery.order.entity.CancelledBy;
import com.metamorph.delivery.order.service.OrderService;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class CustomerOrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        UUID userId = resolveUserId(principal);
        OrderResponse response = orderService.createOrder(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order placed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderSummaryResponse>>> getCustomerOrders(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        UUID userId = resolveUserId(principal);
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderSummaryResponse> orders = orderService.getCustomerOrders(userId, pageable);

        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/track/{publicOrderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> trackOrderByPublicId(
            @PathVariable String publicOrderId) {
        OrderResponse response = orderService.getOrderByPublicOrderId(publicOrderId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable UUID id) {
        OrderResponse response = orderService.getOrder(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable UUID id,
            @Valid @RequestBody CancelOrderRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        UUID userId = resolveUserId(principal);
        OrderResponse response = orderService.cancelOrder(id, request, userId, CancelledBy.CUSTOMER);

        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", response));
    }

    private UUID resolveUserId(UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getUsername()));
        return user.getId();
    }
}
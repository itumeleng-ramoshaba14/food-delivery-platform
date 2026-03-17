package com.metamorph.delivery.order.controller;

import com.metamorph.delivery.common.dto.ApiResponse;
import com.metamorph.delivery.order.dto.*;
import com.metamorph.delivery.order.entity.OrderStatus;
import com.metamorph.delivery.order.service.OrderService;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/restaurant/orders")
@RequiredArgsConstructor
public class RestaurantOrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderSummaryResponse>>> getRestaurantOrders(
            @RequestParam UUID restaurantId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderSummaryResponse> orders = orderService.getRestaurantOrders(restaurantId, status, pageable);

        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable UUID id) {
        OrderResponse response = orderService.getOrder(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<OrderResponse>> acceptOrder(
            @PathVariable UUID id,
            @Valid @RequestBody AcceptOrderRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        UUID actorId = resolveUserId(principal);
        OrderResponse response = orderService.acceptOrder(id, request.getPrepTimeMinutes(), actorId);

        return ResponseEntity.ok(ApiResponse.ok("Order accepted", response));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<OrderResponse>> rejectOrder(
            @PathVariable UUID id,
            @Valid @RequestBody RejectOrderRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        UUID actorId = resolveUserId(principal);
        OrderResponse response = orderService.rejectOrder(id, request.getReason(), actorId);

        return ResponseEntity.ok(ApiResponse.ok("Order rejected", response));
    }

    @PostMapping("/{id}/preparing")
    public ResponseEntity<ApiResponse<OrderResponse>> markPreparing(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {

        UUID actorId = resolveUserId(principal);
        OrderResponse response = orderService.markPreparing(id, actorId);

        return ResponseEntity.ok(ApiResponse.ok("Order is being prepared", response));
    }

    @PostMapping("/{id}/ready")
    public ResponseEntity<ApiResponse<OrderResponse>> markReady(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails principal) {

        UUID actorId = resolveUserId(principal);
        OrderResponse response = orderService.markReady(id, actorId);

        return ResponseEntity.ok(ApiResponse.ok("Order is ready for pickup", response));
    }

    private UUID resolveUserId(UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getUsername()));
        return user.getId();
    }
}
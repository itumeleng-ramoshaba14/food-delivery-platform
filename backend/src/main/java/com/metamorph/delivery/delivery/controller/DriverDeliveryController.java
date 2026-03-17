package com.metamorph.delivery.delivery.controller;

import com.metamorph.delivery.common.dto.ApiResponse;
import com.metamorph.delivery.delivery.dto.DeliveryResponse;
import com.metamorph.delivery.delivery.service.DeliveryService;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/driver/deliveries")
@RequiredArgsConstructor
public class DriverDeliveryController {

    private final DeliveryService deliveryService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getDriverDeliveries(
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Driver deliveries fetched successfully",
                        deliveryService.getDriverDeliveries(driverUserId)));
    }

    @GetMapping("/my-current")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getMyCurrentDeliveries(
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Current driver deliveries fetched successfully",
                        deliveryService.getCurrentDriverDeliveries(driverUserId)));
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getCompletedDeliveries(
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Completed driver deliveries fetched successfully",
                        deliveryService.getCompletedDriverDeliveries(driverUserId)));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getAvailableDeliveries() {
        return ResponseEntity.ok(
                ApiResponse.ok("Available deliveries fetched successfully",
                        deliveryService.getAvailableDeliveries()));
    }

    @PostMapping("/{deliveryId}/accept")
    public ResponseEntity<ApiResponse<DeliveryResponse>> acceptDelivery(
            @PathVariable UUID deliveryId,
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Delivery accepted successfully",
                        deliveryService.acceptDelivery(deliveryId, driverUserId)));
    }

    @PostMapping("/{deliveryId}/pickup")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markPickedUp(
            @PathVariable UUID deliveryId,
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Order picked up successfully",
                        deliveryService.markPickedUp(deliveryId, driverUserId)));
    }

    @PostMapping("/{deliveryId}/en-route")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markEnRoute(
            @PathVariable UUID deliveryId,
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Driver is en route",
                        deliveryService.markEnRoute(deliveryId, driverUserId)));
    }

    @PostMapping("/{deliveryId}/deliver")
    public ResponseEntity<ApiResponse<DeliveryResponse>> markDelivered(
            @PathVariable UUID deliveryId,
            @AuthenticationPrincipal UserDetails principal) {

        UUID driverUserId = resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok("Order delivered successfully",
                        deliveryService.markDelivered(deliveryId, driverUserId)));
    }

    private UUID resolveUserId(UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + principal.getUsername()));
        return user.getId();
    }
}

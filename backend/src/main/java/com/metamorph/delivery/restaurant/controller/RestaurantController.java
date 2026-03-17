package com.metamorph.delivery.restaurant.controller;

import com.metamorph.delivery.common.dto.ApiResponse;
import com.metamorph.delivery.common.exception.ResourceNotFoundException;
import com.metamorph.delivery.menu.dto.MenuItemResponse;
import com.metamorph.delivery.restaurant.dto.RestaurantSummaryResponse;
import com.metamorph.delivery.restaurant.service.RestaurantService;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantSummaryResponse>>> getRestaurants() {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getAllRestaurants()));
    }

    @GetMapping("/my-restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantSummaryResponse>>> getMyRestaurants(
            @AuthenticationPrincipal UserDetails principal) {

        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getRestaurantsByOwner(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantSummaryResponse>> getRestaurant(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getRestaurantById(id)));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getRestaurantMenu(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(restaurantService.getRestaurantMenu(id)));
    }
}
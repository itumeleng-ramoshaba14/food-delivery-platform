package com.metamorph.delivery.restaurant.service;

import com.metamorph.delivery.common.exception.ResourceNotFoundException;
import com.metamorph.delivery.menu.dto.MenuItemResponse;
import com.metamorph.delivery.menu.entity.MenuItem;
import com.metamorph.delivery.menu.repository.MenuItemRepository;
import com.metamorph.delivery.restaurant.dto.RestaurantSummaryResponse;
import com.metamorph.delivery.restaurant.entity.Restaurant;
import com.metamorph.delivery.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public List<RestaurantSummaryResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
                .map(RestaurantSummaryResponse::fromEntity)
                .toList();
    }

    public List<RestaurantSummaryResponse> getRestaurantsByOwner(UUID ownerId) {
        return restaurantRepository.findByOwnerIdAndIsActiveTrue(ownerId).stream()
                .map(RestaurantSummaryResponse::fromEntity)
                .toList();
    }

    public RestaurantSummaryResponse getRestaurantById(UUID id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        return RestaurantSummaryResponse.fromEntity(restaurant);
    }

    public List<MenuItemResponse> getRestaurantMenu(UUID restaurantId) {
        if (!restaurantRepository.existsById(restaurantId)) {
            throw new ResourceNotFoundException("Restaurant not found");
        }

        List<MenuItem> items = menuItemRepository.findByCategoryRestaurantIdAndIsActiveTrue(restaurantId);

        return items.stream()
                .filter(item -> Boolean.TRUE.equals(item.getIsAvailable()))
                .sorted(Comparator.comparing(MenuItem::getSortOrder))
                .map(MenuItemResponse::fromEntity)
                .toList();
    }
}
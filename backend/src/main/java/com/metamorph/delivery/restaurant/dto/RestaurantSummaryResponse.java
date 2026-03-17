package com.metamorph.delivery.restaurant.dto;

import com.metamorph.delivery.restaurant.entity.Restaurant;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class RestaurantSummaryResponse {
    private UUID id;
    private String name;
    private String description;
    private String phone;
    private String email;
    private String addressLine1;
    private String city;
    private Double latitude;
    private Double longitude;
    private String cuisineType;
    private String logoUrl;
    private String bannerUrl;
    private BigDecimal rating;
    private Integer totalRatings;
    private BigDecimal minOrderAmount;
    private Integer avgPrepTimeMinutes;
    private Boolean isActive;
    private Boolean isOpen;
    private LocalTime openingTime;
    private LocalTime closingTime;

    public static RestaurantSummaryResponse fromEntity(Restaurant restaurant) {
        return RestaurantSummaryResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .phone(restaurant.getPhone())
                .email(restaurant.getEmail())
                .addressLine1(restaurant.getAddressLine1())
                .city(restaurant.getCity())
                .latitude(restaurant.getLatitude())
                .longitude(restaurant.getLongitude())
                .cuisineType(restaurant.getCuisineType())
                .logoUrl(restaurant.getLogoUrl())
                .bannerUrl(restaurant.getBannerUrl())
                .rating(restaurant.getRating())
                .totalRatings(restaurant.getTotalRatings())
                .minOrderAmount(restaurant.getMinOrderAmount())
                .avgPrepTimeMinutes(restaurant.getAvgPrepTimeMinutes())
                .isActive(restaurant.getIsActive())
                .isOpen(restaurant.getIsOpen())
                .openingTime(restaurant.getOpeningTime())
                .closingTime(restaurant.getClosingTime())
                .build();
    }
}

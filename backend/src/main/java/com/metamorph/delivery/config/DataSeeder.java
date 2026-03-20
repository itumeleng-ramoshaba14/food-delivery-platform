package com.metamorph.delivery.config;

import com.metamorph.delivery.delivery.entity.DriverProfile;
import com.metamorph.delivery.delivery.entity.VehicleType;
import com.metamorph.delivery.delivery.repository.DriverProfileRepository;
import com.metamorph.delivery.menu.entity.MenuCategory;
import com.metamorph.delivery.menu.entity.MenuItem;
import com.metamorph.delivery.menu.repository.MenuCategoryRepository;
import com.metamorph.delivery.menu.repository.MenuItemRepository;
import com.metamorph.delivery.restaurant.entity.Restaurant;
import com.metamorph.delivery.restaurant.repository.RestaurantRepository;
import com.metamorph.delivery.user.entity.Address;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.entity.UserRole;
import com.metamorph.delivery.user.repository.AddressRepository;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

        private static final UUID TEST_ADDRESS_ID = UUID.fromString("98868900-79ca-40f3-a385-337b8afd370f");

        private final UserRepository userRepository;
        private final AddressRepository addressRepository;
        private final RestaurantRepository restaurantRepository;
        private final MenuItemRepository menuItemRepository;
        private final PasswordEncoder passwordEncoder;
        private final MenuCategoryRepository menuCategoryRepository;
        private final DriverProfileRepository driverProfileRepository;

        @Bean
        CommandLineRunner seedData() {
                return args -> {

                        // ─────────────────────────────────────────────────────────────
                        // Customer
                        // ─────────────────────────────────────────────────────────────
                        User customer = userRepository.findByEmail("test@test.com")
                                        .orElseGet(() -> userRepository.save(
                                                        User.builder()
                                                                        .email("test@test.com")
                                                                        .phone("+27744444444")
                                                                        .firstName("Test")
                                                                        .lastName("Customer")
                                                                        .role(UserRole.CUSTOMER)
                                                                        .password(passwordEncoder.encode("12345678"))
                                                                        .emailVerified(true)
                                                                        .phoneVerified(true)
                                                                        .build()));

                        if (!addressRepository.existsById(TEST_ADDRESS_ID)) {
                                Address address = Address.builder()
                                                .id(TEST_ADDRESS_ID)
                                                .user(customer)
                                                .label("Home")
                                                .addressLine1("45 Commissioner Street")
                                                .addressLine2("Apartment 12")
                                                .city("Johannesburg")
                                                .state("Gauteng")
                                                .postalCode("2001")
                                                .country("ZA")
                                                .latitude(-26.2041)
                                                .longitude(28.0473)
                                                .isDefault(true)
                                                .build();

                                addressRepository.save(address);
                        }

                        // ─────────────────────────────────────────────────────────────
                        // Restaurant owners (different owners for different restaurants)
                        // ─────────────────────────────────────────────────────────────
                        // ─────────────────────────────────────────────────────────────
                        // Restaurant owners (different owners for different restaurants)
                        // ─────────────────────────────────────────────────────────────
                        User burgerOwner = userRepository.findByEmail("burger.owner@test.com")
                                        .orElseGet(() -> userRepository.save(
                                                        User.builder()
                                                                        .email("burger.owner@test.com")
                                                                        .phone("+27781111111")
                                                                        .firstName("Burger")
                                                                        .lastName("Owner")
                                                                        .role(UserRole.RESTAURANT_STAFF)
                                                                        .password(passwordEncoder.encode("12345678"))
                                                                        .emailVerified(true)
                                                                        .phoneVerified(true)
                                                                        .build()));

                        User pizzaOwner = userRepository.findByEmail("pizza.owner@test.com")
                                        .orElseGet(() -> userRepository.save(
                                                        User.builder()
                                                                        .email("pizza.owner@test.com")
                                                                        .phone("+27782222222")
                                                                        .firstName("Pizza")
                                                                        .lastName("Owner")
                                                                        .role(UserRole.RESTAURANT_STAFF)
                                                                        .password(passwordEncoder.encode("12345678"))
                                                                        .emailVerified(true)
                                                                        .phoneVerified(true)
                                                                        .build()));

                        User sushiOwner = userRepository.findByEmail("sushi.owner@test.com")
                                        .orElseGet(() -> userRepository.save(
                                                        User.builder()
                                                                        .email("sushi.owner@test.com")
                                                                        .phone("+27783333333")
                                                                        .firstName("Sushi")
                                                                        .lastName("Owner")
                                                                        .role(UserRole.RESTAURANT_STAFF)
                                                                        .password(passwordEncoder.encode("12345678"))
                                                                        .emailVerified(true)
                                                                        .phoneVerified(true)
                                                                        .build()));

                        // ─────────────────────────────────────────────────────────────
                        // Driver
                        // ─────────────────────────────────────────────────────────────
                        User driver = userRepository.findByEmail("driver@test.com")
                                        .orElseGet(() -> userRepository.save(
                                                        User.builder()
                                                                        .email("driver@test.com")
                                                                        .phone("+27733333333")
                                                                        .firstName("Demo")
                                                                        .lastName("Driver")
                                                                        .role(UserRole.DRIVER)
                                                                        .password(passwordEncoder.encode("12345678"))
                                                                        .emailVerified(true)
                                                                        .phoneVerified(true)
                                                                        .build()));

                        if (driverProfileRepository.findAll().isEmpty()) {
                                DriverProfile driverProfile = DriverProfile.builder()
                                                .user(driver)
                                                .vehicleType(VehicleType.MOTORCYCLE)
                                                .vehicleMake("Honda")
                                                .vehicleModel("CB125")
                                                .vehiclePlate("GP 12345")
                                                .isVerified(true)
                                                .isOnline(true)
                                                .currentLatitude(-26.2041)
                                                .currentLongitude(28.0473)
                                                .build();

                                driverProfileRepository.save(driverProfile);
                        }

                        // ─────────────────────────────────────────────────────────────
                        // Restaurants
                        // ─────────────────────────────────────────────────────────────
                        Restaurant burgerPalace = restaurantRepository.findAll().stream()
                                        .filter(r -> "Burger Palace".equalsIgnoreCase(r.getName()))
                                        .findFirst()
                                        .map(existing -> {
                                                existing.setOwner(burgerOwner);
                                                return restaurantRepository.save(existing);
                                        })
                                        .orElseGet(() -> restaurantRepository.save(
                                                        Restaurant.builder()
                                                                        .name("Burger Palace")
                                                                        .description("Best burgers in town")
                                                                        .owner(burgerOwner)
                                                                        .phone("+27722222222")
                                                                        .email("burger@palace.com")
                                                                        .addressLine1("123 Main Street")
                                                                        .city("Johannesburg")
                                                                        .latitude(-26.2041)
                                                                        .longitude(28.0473)
                                                                        .cuisineType("Burgers")
                                                                        .logoUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80")
                                                                        .bannerUrl("https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80")
                                                                        .isActive(true)
                                                                        .isOpen(true)
                                                                        .avgPrepTimeMinutes(20)
                                                                        .minOrderAmount(new BigDecimal("50"))
                                                                        .build()));

                        Restaurant pizzaCorner = restaurantRepository.findAll().stream()
                                        .filter(r -> "Pizza Corner".equalsIgnoreCase(r.getName()))
                                        .findFirst()
                                        .map(existing -> {
                                                existing.setOwner(pizzaOwner);
                                                return restaurantRepository.save(existing);
                                        })
                                        .orElseGet(() -> restaurantRepository.save(
                                                        Restaurant.builder()
                                                                        .name("Pizza Corner")
                                                                        .description("Wood-fired pizza and cheesy favourites")
                                                                        .owner(pizzaOwner)
                                                                        .phone("+27725555555")
                                                                        .email("pizza@corner.com")
                                                                        .addressLine1("22 Oxford Road")
                                                                        .city("Johannesburg")
                                                                        .latitude(-26.1450)
                                                                        .longitude(28.0416)
                                                                        .cuisineType("Pizza")
                                                                        .logoUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80")
                                                                        .bannerUrl("https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=1200&q=80")
                                                                        .isActive(true)
                                                                        .isOpen(true)
                                                                        .avgPrepTimeMinutes(25)
                                                                        .minOrderAmount(new BigDecimal("60"))
                                                                        .build()));

                        Restaurant sushiSpot = restaurantRepository.findAll().stream()
                                        .filter(r -> "Sushi Spot".equalsIgnoreCase(r.getName()))
                                        .findFirst()
                                        .map(existing -> {
                                                existing.setOwner(sushiOwner);
                                                return restaurantRepository.save(existing);
                                        })
                                        .orElseGet(() -> restaurantRepository.save(
                                                        Restaurant.builder()
                                                                        .name("Sushi Spot")
                                                                        .description("Fresh sushi, poke bowls, and light meals")
                                                                        .owner(sushiOwner)
                                                                        .phone("+27726666666")
                                                                        .email("sushi@spot.com")
                                                                        .addressLine1("78 Rivonia Road")
                                                                        .city("Sandton")
                                                                        .latitude(-26.1076)
                                                                        .longitude(28.0567)
                                                                        .cuisineType("Sushi")
                                                                        .logoUrl("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80")
                                                                        .bannerUrl("https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80")
                                                                        .isActive(true)
                                                                        .isOpen(true)
                                                                        .avgPrepTimeMinutes(30)
                                                                        .minOrderAmount(new BigDecimal("80"))
                                                                        .build()));

                        // ─────────────────────────────────────────────────────────────
                        // Categories
                        // ─────────────────────────────────────────────────────────────
                        MenuCategory burgerCategory = getOrCreateCategory(
                                        burgerPalace, "Burgers", "Delicious burgers", 1);
                        MenuCategory burgerDrinksCategory = getOrCreateCategory(
                                        burgerPalace, "Drinks", "Cold beverages", 2);

                        MenuCategory pizzaCategory = getOrCreateCategory(
                                        pizzaCorner, "Pizza", "Freshly baked pizzas", 1);
                        MenuCategory pizzaSidesCategory = getOrCreateCategory(
                                        pizzaCorner, "Sides", "Tasty sides and extras", 2);

                        MenuCategory sushiCategory = getOrCreateCategory(
                                        sushiSpot, "Sushi", "Fresh sushi selections", 1);
                        MenuCategory sushiDrinksCategory = getOrCreateCategory(
                                        sushiSpot, "Drinks", "Refreshing drinks", 2);

                        // ─────────────────────────────────────────────────────────────
                        // Burger Palace items
                        // ─────────────────────────────────────────────────────────────
                        getOrCreateMenuItem(
                                        burgerCategory,
                                        "Classic Burger",
                                        "Beef patty with lettuce and tomato",
                                        new BigDecimal("79.99"),
                                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
                                        1);

                        getOrCreateMenuItem(
                                        burgerCategory,
                                        "Cheese Burger",
                                        "Beef patty with melted cheese",
                                        new BigDecimal("89.99"),
                                        "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80",
                                        2);

                        getOrCreateMenuItem(
                                        burgerDrinksCategory,
                                        "Coca Cola",
                                        "330ml can",
                                        new BigDecimal("19.99"),
                                        "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80",
                                        1);

                        // ─────────────────────────────────────────────────────────────
                        // Pizza Corner items
                        // ─────────────────────────────────────────────────────────────
                        getOrCreateMenuItem(
                                        pizzaCategory,
                                        "Margherita Pizza",
                                        "Classic tomato, mozzarella, and basil",
                                        new BigDecimal("99.99"),
                                        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
                                        1);

                        getOrCreateMenuItem(
                                        pizzaCategory,
                                        "Pepperoni Pizza",
                                        "Loaded with pepperoni and mozzarella",
                                        new BigDecimal("119.99"),
                                        "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
                                        2);

                        getOrCreateMenuItem(
                                        pizzaSidesCategory,
                                        "Garlic Bread",
                                        "Oven-baked garlic bread",
                                        new BigDecimal("39.99"),
                                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                                        1);

                        // ─────────────────────────────────────────────────────────────
                        // Sushi Spot items
                        // ─────────────────────────────────────────────────────────────
                        getOrCreateMenuItem(
                                        sushiCategory,
                                        "Salmon California Roll",
                                        "Fresh salmon with avocado and cucumber",
                                        new BigDecimal("109.99"),
                                        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=800&q=80",
                                        1);

                        getOrCreateMenuItem(
                                        sushiCategory,
                                        "Poke Bowl",
                                        "Rice bowl with fresh salmon and vegetables",
                                        new BigDecimal("129.99"),
                                        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
                                        2);

                        getOrCreateMenuItem(
                                        sushiDrinksCategory,
                                        "Sparkling Water",
                                        "Still or sparkling bottled water",
                                        new BigDecimal("24.99"),
                                        "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
                                        1);

                        System.out.println("Seed data inserted successfully");
                        System.out.println("Test customer login: test@test.com / 12345678");
                        System.out.println("Test restaurant owner login 1: burger.owner@test.com / 12345678");
                        System.out.println("Test restaurant owner login 2: pizza.owner@test.com / 12345678");
                        System.out.println("Test restaurant owner login 3: sushi.owner@test.com / 12345678");
                        System.out.println("Test driver login: driver@test.com / 12345678");
                        System.out.println("Test delivery address UUID: " + TEST_ADDRESS_ID);
                };
        }

        private MenuCategory getOrCreateCategory(
                        Restaurant restaurant,
                        String name,
                        String description,
                        int sortOrder) {
                return menuCategoryRepository.findAll().stream()
                                .filter(c -> c.getRestaurant().getId().equals(restaurant.getId())
                                                && name.equalsIgnoreCase(c.getName()))
                                .findFirst()
                                .orElseGet(() -> menuCategoryRepository.save(
                                                MenuCategory.builder()
                                                                .restaurant(restaurant)
                                                                .name(name)
                                                                .description(description)
                                                                .sortOrder(sortOrder)
                                                                .build()));
        }

        private MenuItem getOrCreateMenuItem(
                        MenuCategory category,
                        String name,
                        String description,
                        BigDecimal price,
                        String imageUrl,
                        int sortOrder) {
                return menuItemRepository.findAll().stream()
                                .filter(item -> item.getCategory().getId().equals(category.getId())
                                                && name.equalsIgnoreCase(item.getName()))
                                .findFirst()
                                .orElseGet(() -> menuItemRepository.save(
                                                MenuItem.builder()
                                                                .category(category)
                                                                .name(name)
                                                                .description(description)
                                                                .price(price)
                                                                .imageUrl(imageUrl)
                                                                .isAvailable(true)
                                                                .isActive(true)
                                                                .sortOrder(sortOrder)
                                                                .build()));
        }
}
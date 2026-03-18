package com.metamorph.delivery.order.service;

import com.metamorph.delivery.common.exception.ResourceNotFoundException;
import com.metamorph.delivery.common.util.PublicIdGenerator;
import com.metamorph.delivery.delivery.entity.Delivery;
import com.metamorph.delivery.delivery.entity.DeliveryStatus;
import com.metamorph.delivery.delivery.repository.DeliveryRepository;
import com.metamorph.delivery.menu.entity.MenuItem;
import com.metamorph.delivery.menu.repository.MenuItemRepository;
import com.metamorph.delivery.order.dto.CancelOrderRequest;
import com.metamorph.delivery.order.dto.CreateOrderRequest;
import com.metamorph.delivery.order.dto.OrderItemResponse;
import com.metamorph.delivery.order.dto.OrderResponse;
import com.metamorph.delivery.order.dto.OrderSummaryResponse;
import com.metamorph.delivery.order.entity.CancelledBy;
import com.metamorph.delivery.order.entity.Order;
import com.metamorph.delivery.order.entity.OrderItem;
import com.metamorph.delivery.order.entity.OrderStatus;
import com.metamorph.delivery.order.repository.OrderRepository;
import com.metamorph.delivery.restaurant.entity.Restaurant;
import com.metamorph.delivery.restaurant.repository.RestaurantRepository;
import com.metamorph.delivery.user.entity.Address;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.AddressRepository;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final DeliveryRepository deliveryRepository;

    private static final BigDecimal DEFAULT_DELIVERY_FEE = new BigDecimal("25.00");

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, UUID userId) {
        if (request == null) {
            throw new IllegalArgumentException("Order request is required");
        }

        if (request.getRestaurantId() == null) {
            throw new IllegalArgumentException("Restaurant ID is required");
        }

        if (request.getDeliveryAddressId() == null) {
            throw new IllegalArgumentException("Delivery address ID is required");
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Address deliveryAddress = addressRepository.findById(request.getDeliveryAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery address not found"));

        if (deliveryAddress.getUser() == null || !deliveryAddress.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Delivery address does not belong to the logged-in customer");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (var itemRequest : request.getItems()) {
            if (itemRequest.getMenuItemId() == null) {
                throw new IllegalArgumentException("Menu item ID is required");
            }

            if (itemRequest.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }

            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Menu item not found: " + itemRequest.getMenuItemId()));

            BigDecimal unitPrice = menuItem.getPrice().setScale(2, RoundingMode.HALF_UP);
            BigDecimal lineTotal = unitPrice
                    .multiply(BigDecimal.valueOf(itemRequest.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            subtotal = subtotal.add(lineTotal).setScale(2, RoundingMode.HALF_UP);

            OrderItem orderItem = OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .menuItemName(menuItem.getName())
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build();

            orderItems.add(orderItem);
        }

        return createAndSaveOrder(subtotal, orderItems, restaurant, customer, deliveryAddress);
    }

    private OrderResponse createAndSaveOrder(
            BigDecimal subtotal,
            List<OrderItem> orderItems,
            Restaurant restaurant,
            User customer,
            Address deliveryAddress) {

        BigDecimal deliveryFee = DEFAULT_DELIVERY_FEE.setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(deliveryFee).setScale(2, RoundingMode.HALF_UP);

        Order order = Order.builder()
                .publicOrderId(generateUniquePublicOrderId())
                .publicDeliveryId(generateUniquePublicDeliveryId())
                .deliveryId("delivery-temp")
                .restaurant(restaurant)
                .customer(customer)
                .deliveryAddress(deliveryAddress)
                .status(OrderStatus.PLACED)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .totalAmount(totalAmount)
                .placedAt(LocalDateTime.now())
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }

        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        savedOrder.setDeliveryId("delivery-" + savedOrder.getId());
        savedOrder = orderRepository.save(savedOrder);

        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getCustomerOrders(UUID userId, Pageable pageable) {
        return orderRepository.findByCustomerIdOrderByPlacedAtDesc(userId, pageable)
                .map(this::mapToSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getRestaurantOrders(UUID restaurantId, OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByRestaurantIdAndStatusOrderByPlacedAtDesc(restaurantId, status, pageable)
                    .map(this::mapToSummaryResponse);
        }

        return orderRepository.findByRestaurantIdOrderByPlacedAtDesc(restaurantId, pageable)
                .map(this::mapToSummaryResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByPublicOrderId(String publicOrderId) {
        Order order = orderRepository.findByPublicOrderId(publicOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(UUID id, CancelOrderRequest request, UUID actorId, CancelledBy cancelledBy) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED);
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse acceptOrder(UUID id, int prepTimeMinutes, UUID actorId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.ACCEPTED);
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse rejectOrder(UUID id, String reason, UUID actorId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED);
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse markPreparing(UUID id, UUID actorId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.PREPARING);
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse markReady(UUID id, UUID actorId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(OrderStatus.READY);
        Order savedOrder = orderRepository.save(order);

        Delivery existingDelivery = deliveryRepository.findByOrderId(savedOrder.getId()).orElse(null);

        if (existingDelivery == null) {
            String pickupAddress = "Restaurant pickup";
            Double pickupLatitude = null;
            Double pickupLongitude = null;

            if (savedOrder.getRestaurant() != null) {
                String restaurantName = savedOrder.getRestaurant().getName() != null
                        ? savedOrder.getRestaurant().getName()
                        : "Restaurant";
                String city = savedOrder.getRestaurant().getCity() != null
                        ? savedOrder.getRestaurant().getCity()
                        : "";

                pickupAddress = city.isBlank() ? restaurantName : restaurantName + ", " + city;
                pickupLatitude = savedOrder.getRestaurant().getLatitude();
                pickupLongitude = savedOrder.getRestaurant().getLongitude();
            }

            String dropoffAddress = "Customer address";
            Double dropoffLatitude = null;
            Double dropoffLongitude = null;

            if (savedOrder.getDeliveryAddress() != null) {
                String line1 = savedOrder.getDeliveryAddress().getAddressLine1() != null
                        ? savedOrder.getDeliveryAddress().getAddressLine1()
                        : "";
                String city = savedOrder.getDeliveryAddress().getCity() != null
                        ? savedOrder.getDeliveryAddress().getCity()
                        : "";
                String postalCode = savedOrder.getDeliveryAddress().getPostalCode() != null
                        ? savedOrder.getDeliveryAddress().getPostalCode()
                        : "";

                StringBuilder addressBuilder = new StringBuilder();
                if (!line1.isBlank()) {
                    addressBuilder.append(line1);
                }
                if (!city.isBlank()) {
                    if (addressBuilder.length() > 0) {
                        addressBuilder.append(", ");
                    }
                    addressBuilder.append(city);
                }
                if (!postalCode.isBlank()) {
                    if (addressBuilder.length() > 0) {
                        addressBuilder.append(" ");
                    }
                    addressBuilder.append(postalCode);
                }

                dropoffAddress = addressBuilder.length() > 0 ? addressBuilder.toString() : "Customer address";
                dropoffLatitude = savedOrder.getDeliveryAddress().getLatitude();
                dropoffLongitude = savedOrder.getDeliveryAddress().getLongitude();
            }

            Delivery delivery = Delivery.builder()
                    .order(savedOrder)
                    .status(DeliveryStatus.PENDING)
                    .pickupAddress(pickupAddress)
                    .pickupLatitude(pickupLatitude)
                    .pickupLongitude(pickupLongitude)
                    .dropoffAddress(dropoffAddress)
                    .dropoffLatitude(dropoffLatitude)
                    .dropoffLongitude(dropoffLongitude)
                    .distanceKm(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                    .estimatedMinutes(20)
                    .actualMinutes(null)
                    .deliveryOtp("1234")
                    .build();

            deliveryRepository.save(delivery);
        }

        return mapToResponse(savedOrder);
    }

    private String generateUniquePublicOrderId() {
        String code;
        do {
            code = PublicIdGenerator.generate("ORD");
        } while (orderRepository.existsByPublicOrderId(code));
        return code;
    }

    private String generateUniquePublicDeliveryId() {
        String code;
        do {
            code = PublicIdGenerator.generate("DLV");
        } while (orderRepository.existsByPublicDeliveryId(code));
        return code;
    }

    private OrderSummaryResponse mapToSummaryResponse(Order order) {
        int itemCount = 0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                itemCount += item.getQuantity() != null ? item.getQuantity() : 0;
            }
        }

        return OrderSummaryResponse.builder()
                .id(order.getId())
                .restaurantName(order.getRestaurant() != null ? order.getRestaurant().getName() : null)
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .itemCount(itemCount)
                .placedAt(order.getPlacedAt())
                .build();
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                itemResponses.add(OrderItemResponse.builder()
                        .menuItemId(item.getMenuItemId())
                        .menuItemName(item.getMenuItemName())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice() != null
                                ? item.getUnitPrice().setScale(2, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                        .lineTotal(item.getLineTotal() != null
                                ? item.getLineTotal().setScale(2, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                        .build());
            }
        }

        return OrderResponse.builder()
                .id(order.getId())
                .publicOrderId(order.getPublicOrderId())
                .deliveryId(order.getDeliveryId())
                .publicDeliveryId(order.getPublicDeliveryId())
                .status(order.getStatus() != null ? order.getStatus().name() : null)
                .subtotal(order.getSubtotal() != null
                        ? order.getSubtotal().setScale(2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .deliveryFee(order.getDeliveryFee() != null
                        ? order.getDeliveryFee().setScale(2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .totalAmount(order.getTotalAmount() != null
                        ? order.getTotalAmount().setScale(2, RoundingMode.HALF_UP)
                        : BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .placedAt(order.getPlacedAt())
                .items(itemResponses)
                .build();
    }
}
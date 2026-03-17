package com.metamorph.delivery.delivery.service;

import com.metamorph.delivery.common.exception.ApiException;
import com.metamorph.delivery.common.exception.ResourceNotFoundException;
import com.metamorph.delivery.delivery.dto.DeliveryResponse;
import com.metamorph.delivery.delivery.entity.Delivery;
import com.metamorph.delivery.delivery.entity.DeliveryStatus;
import com.metamorph.delivery.delivery.entity.DriverProfile;
import com.metamorph.delivery.delivery.repository.DeliveryRepository;
import com.metamorph.delivery.delivery.repository.DriverProfileRepository;
import com.metamorph.delivery.order.entity.Order;
import com.metamorph.delivery.order.entity.OrderEvent;
import com.metamorph.delivery.order.entity.OrderEventType;
import com.metamorph.delivery.order.entity.OrderStatus;
import com.metamorph.delivery.order.repository.OrderEventRepository;
import com.metamorph.delivery.order.repository.OrderRepository;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryService {

        private final DeliveryRepository deliveryRepository;
        private final DriverProfileRepository driverProfileRepository;
        private final OrderRepository orderRepository;
        private final OrderEventRepository orderEventRepository;
        private final UserRepository userRepository;

        public DeliveryResponse assignDriver(UUID orderId, UUID driverUserId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

                if (order.getStatus() != OrderStatus.READY && order.getStatus() != OrderStatus.DRIVER_ASSIGNED) {
                        throw new ApiException(
                                        "Only READY or DRIVER_ASSIGNED orders can be assigned to a driver",
                                        HttpStatus.CONFLICT);
                }

                User driver = userRepository.findById(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

                DriverProfile driverProfile = driverProfileRepository.findByUserId(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

                if (!Boolean.TRUE.equals(driverProfile.getIsVerified())
                                || !Boolean.TRUE.equals(driverProfile.getIsOnline())) {
                        throw new ApiException("Driver must be verified and online", HttpStatus.CONFLICT);
                }

                Delivery delivery = deliveryRepository.findByOrderId(orderId).orElse(
                                Delivery.builder()
                                                .order(order)
                                                .pickupAddress("Restaurant pickup")
                                                .pickupLatitude(null)
                                                .pickupLongitude(null)
                                                .dropoffAddress("Customer delivery address")
                                                .dropoffLatitude(null)
                                                .dropoffLongitude(null)
                                                .distanceKm(new BigDecimal("8.50"))
                                                .estimatedMinutes(25)
                                                .deliveryOtp("1234")
                                                .build());

                if (delivery.getDriver() != null && !delivery.getDriver().getId().equals(driverUserId)) {
                        throw new ApiException("Delivery already assigned to another driver", HttpStatus.CONFLICT);
                }

                delivery.setDriver(driver);
                delivery.setStatus(DeliveryStatus.DRIVER_ASSIGNED);

                if (delivery.getAssignedAt() == null) {
                        delivery.setAssignedAt(LocalDateTime.now());
                }

                delivery = deliveryRepository.save(delivery);

                order.setStatus(OrderStatus.DRIVER_ASSIGNED);
                orderRepository.save(order);

                orderEventRepository.save(OrderEvent.builder()
                                .order(order)
                                .eventType(OrderEventType.DRIVER_ASSIGNED)
                                .actor(driver)
                                .notes("Driver assigned to order")
                                .build());

                return DeliveryResponse.fromEntity(delivery);
        }

        public DeliveryResponse autoAssignDriver(UUID orderId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

                if (order.getStatus() != OrderStatus.READY) {
                        throw new ApiException("Only READY orders can be auto-assigned", HttpStatus.CONFLICT);
                }

                Delivery existingDelivery = deliveryRepository.findByOrderId(orderId).orElse(null);
                if (existingDelivery != null && existingDelivery.getDriver() != null) {
                        return DeliveryResponse.fromEntity(existingDelivery);
                }

                List<DriverProfile> availableDrivers = driverProfileRepository.findByIsOnlineTrueAndIsVerifiedTrue()
                                .stream()
                                .sorted(Comparator.comparing(DriverProfile::getCreatedAt))
                                .toList();

                if (availableDrivers.isEmpty()) {
                        throw new ApiException("No verified online drivers are available", HttpStatus.CONFLICT);
                }

                DriverProfile selectedDriver = availableDrivers.get(0);
                return assignDriver(orderId, selectedDriver.getUser().getId());
        }

        public List<DeliveryResponse> getDriverDeliveries(UUID driverUserId) {
                return deliveryRepository.findByDriverId(driverUserId).stream()
                                .map(DeliveryResponse::fromEntity)
                                .toList();
        }

        public List<DeliveryResponse> getCurrentDriverDeliveries(UUID driverUserId) {
                return deliveryRepository.findByDriverId(driverUserId).stream()
                                .filter(delivery -> delivery.getStatus() != DeliveryStatus.DELIVERED)
                                .map(DeliveryResponse::fromEntity)
                                .toList();
        }

        public List<DeliveryResponse> getCompletedDriverDeliveries(UUID driverUserId) {
                return deliveryRepository.findByDriverId(driverUserId).stream()
                                .filter(delivery -> delivery.getStatus() == DeliveryStatus.DELIVERED)
                                .map(DeliveryResponse::fromEntity)
                                .toList();
        }

        public List<DeliveryResponse> getAvailableDeliveries() {
                return deliveryRepository.findAll().stream()
                                .filter(delivery -> delivery.getDriver() == null
                                                && delivery.getOrder() != null
                                                && delivery.getOrder().getStatus() == OrderStatus.READY)
                                .map(DeliveryResponse::fromEntity)
                                .toList();
        }

        public DeliveryResponse acceptDelivery(UUID deliveryId, UUID driverUserId) {
                Delivery delivery = deliveryRepository.findById(deliveryId)
                                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));

                User driver = userRepository.findById(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

                DriverProfile driverProfile = driverProfileRepository.findByUserId(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

                if (!Boolean.TRUE.equals(driverProfile.getIsVerified())
                                || !Boolean.TRUE.equals(driverProfile.getIsOnline())) {
                        throw new ApiException("Driver must be verified and online", HttpStatus.CONFLICT);
                }

                if (delivery.getDriver() != null && !delivery.getDriver().getId().equals(driverUserId)) {
                        throw new ApiException("Delivery is already assigned to another driver", HttpStatus.CONFLICT);
                }

                if (delivery.getDriver() == null) {
                        delivery.setDriver(driver);
                        delivery.setAssignedAt(LocalDateTime.now());
                }

                delivery.setStatus(DeliveryStatus.DRIVER_ASSIGNED);
                delivery = deliveryRepository.save(delivery);

                Order order = delivery.getOrder();
                order.setStatus(OrderStatus.DRIVER_ASSIGNED);
                orderRepository.save(order);

                orderEventRepository.save(OrderEvent.builder()
                                .order(order)
                                .eventType(OrderEventType.DRIVER_ASSIGNED)
                                .actor(driver)
                                .notes("Driver accepted delivery assignment")
                                .build());

                return DeliveryResponse.fromEntity(delivery);
        }

        public DeliveryResponse markPickedUp(UUID deliveryId, UUID driverUserId) {
                Delivery delivery = getDriverDelivery(deliveryId, driverUserId);

                if (delivery.getStatus() != DeliveryStatus.DRIVER_ASSIGNED
                                && delivery.getStatus() != DeliveryStatus.ARRIVED_PICKUP) {
                        throw new ApiException(
                                        "Delivery cannot be picked up from status " + delivery.getStatus(),
                                        HttpStatus.CONFLICT);
                }

                delivery.setStatus(DeliveryStatus.PICKED_UP);
                delivery.setPickedUpAt(LocalDateTime.now());
                delivery = deliveryRepository.save(delivery);

                Order order = delivery.getOrder();
                order.setStatus(OrderStatus.PICKED_UP);
                order.setPickedUpAt(LocalDateTime.now());
                orderRepository.save(order);

                User driver = userRepository.findById(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

                orderEventRepository.save(OrderEvent.builder()
                                .order(order)
                                .eventType(OrderEventType.PICKED_UP)
                                .actor(driver)
                                .notes("Order picked up by driver")
                                .build());

                return DeliveryResponse.fromEntity(delivery);
        }

        public DeliveryResponse markEnRoute(UUID deliveryId, UUID driverUserId) {
                Delivery delivery = getDriverDelivery(deliveryId, driverUserId);

                if (delivery.getStatus() != DeliveryStatus.PICKED_UP) {
                        throw new ApiException(
                                        "Delivery cannot move to EN_ROUTE from status " + delivery.getStatus(),
                                        HttpStatus.CONFLICT);
                }

                delivery.setStatus(DeliveryStatus.EN_ROUTE);
                delivery = deliveryRepository.save(delivery);

                Order order = delivery.getOrder();
                order.setStatus(OrderStatus.EN_ROUTE);
                orderRepository.save(order);

                User driver = userRepository.findById(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

                orderEventRepository.save(OrderEvent.builder()
                                .order(order)
                                .eventType(OrderEventType.EN_ROUTE)
                                .actor(driver)
                                .notes("Driver is en route to customer")
                                .build());

                return DeliveryResponse.fromEntity(delivery);
        }

        public DeliveryResponse markDelivered(UUID deliveryId, UUID driverUserId) {
                Delivery delivery = getDriverDelivery(deliveryId, driverUserId);

                if (delivery.getStatus() != DeliveryStatus.EN_ROUTE
                                && delivery.getStatus() != DeliveryStatus.ARRIVED_DROPOFF) {
                        throw new ApiException(
                                        "Delivery cannot be marked delivered from status " + delivery.getStatus(),
                                        HttpStatus.CONFLICT);
                }

                delivery.setStatus(DeliveryStatus.DELIVERED);
                delivery.setDeliveredAt(LocalDateTime.now());
                delivery.setActualMinutes(delivery.getEstimatedMinutes());
                delivery = deliveryRepository.save(delivery);

                Order order = delivery.getOrder();
                order.setStatus(OrderStatus.DELIVERED);
                order.setDeliveredAt(LocalDateTime.now());
                orderRepository.save(order);

                User driver = userRepository.findById(driverUserId)
                                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

                orderEventRepository.save(OrderEvent.builder()
                                .order(order)
                                .eventType(OrderEventType.DELIVERED)
                                .actor(driver)
                                .notes("Order delivered successfully")
                                .build());

                return DeliveryResponse.fromEntity(delivery);
        }

        private Delivery getDriverDelivery(UUID deliveryId, UUID driverUserId) {
                Delivery delivery = deliveryRepository.findById(deliveryId)
                                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found"));

                if (delivery.getDriver() == null || !delivery.getDriver().getId().equals(driverUserId)) {
                        throw new ApiException("This delivery is not assigned to the driver", HttpStatus.FORBIDDEN);
                }

                return delivery;
        }
}
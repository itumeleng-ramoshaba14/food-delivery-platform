package com.metamorph.delivery.order.event;

import com.metamorph.delivery.order.entity.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public void publishStatusChange(UUID orderId, OrderStatus previousStatus,
            OrderStatus newStatus, UUID actorId) {
        log.info("Publishing order status change: orderId={}, {} -> {}",
                orderId, previousStatus, newStatus);

        OrderStatusChangedEvent event = new OrderStatusChangedEvent(
                this,
                orderId,
                previousStatus,
                newStatus,
                actorId,
                LocalDateTime.now());

        applicationEventPublisher.publishEvent(event);
    }
}
package com.metamorph.delivery.order.event;

import com.metamorph.delivery.order.entity.OrderStatus;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class OrderStatusChangedEvent extends ApplicationEvent {

    private final UUID orderId;
    private final OrderStatus previousStatus;
    private final OrderStatus newStatus;
    private final UUID actorId;
    private final LocalDateTime occurredAt;

    public OrderStatusChangedEvent(
            Object source,
            UUID orderId,
            OrderStatus previousStatus,
            OrderStatus newStatus,
            UUID actorId,
            LocalDateTime occurredAt) {
        super(source);
        this.orderId = orderId;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.actorId = actorId;
        this.occurredAt = occurredAt;
    }
}
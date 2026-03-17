package com.metamorph.delivery.order.statemachine;

import com.metamorph.delivery.order.entity.OrderStatus;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class OrderStateMachine {

    private static final Map<OrderStatus, Set<OrderStatus>> TRANSITIONS;

    static {
        Map<OrderStatus, Set<OrderStatus>> map = new HashMap<>();

        map.put(OrderStatus.PLACED, EnumSet.of(
                OrderStatus.ACCEPTED,
                OrderStatus.CANCELLED));

        map.put(OrderStatus.ACCEPTED, EnumSet.of(
                OrderStatus.PREPARING,
                OrderStatus.CANCELLED));

        map.put(OrderStatus.PREPARING, EnumSet.of(
                OrderStatus.READY,
                OrderStatus.CANCELLED));

        map.put(OrderStatus.READY, EnumSet.of(
                OrderStatus.DRIVER_ASSIGNED,
                OrderStatus.PICKED_UP,
                OrderStatus.CANCELLED));

        map.put(OrderStatus.DRIVER_ASSIGNED, EnumSet.of(
                OrderStatus.PICKED_UP,
                OrderStatus.CANCELLED));

        map.put(OrderStatus.PICKED_UP, EnumSet.of(
                OrderStatus.EN_ROUTE));

        map.put(OrderStatus.EN_ROUTE, EnumSet.of(
                OrderStatus.DELIVERED));

        map.put(OrderStatus.DELIVERED, Collections.emptySet());
        map.put(OrderStatus.CANCELLED, Collections.emptySet());

        TRANSITIONS = Collections.unmodifiableMap(map);
    }

    public boolean canTransition(OrderStatus from, OrderStatus to) {
        return TRANSITIONS.getOrDefault(from, Collections.emptySet()).contains(to);
    }
}

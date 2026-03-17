package com.metamorph.delivery.order.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_item_modifiers", indexes = {
        @Index(name = "idx_order_item_modifiers_order_item_id", columnList = "order_item_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemModifier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(nullable = false)
    private String modifierName;

    @Column(nullable = false)
    private String optionName;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;
}

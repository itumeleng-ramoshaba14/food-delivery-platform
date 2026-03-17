package com.metamorph.delivery.menu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "modifier_groups", indexes = {
        @Index(name = "idx_modifier_groups_menu_item_id", columnList = "menu_item_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifierGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private Integer minSelections = 0;

    @Builder.Default
    private Integer maxSelections = 1;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isRequired = false;
}

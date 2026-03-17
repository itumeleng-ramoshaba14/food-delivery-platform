package com.metamorph.delivery.menu.repository;

import com.metamorph.delivery.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, UUID> {

    List<MenuItem> findByCategoryId(UUID categoryId);

    List<MenuItem> findByCategoryRestaurantIdAndIsActiveTrue(UUID restaurantId);
}

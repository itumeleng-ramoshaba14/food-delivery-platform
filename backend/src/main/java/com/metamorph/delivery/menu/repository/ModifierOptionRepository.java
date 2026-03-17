package com.metamorph.delivery.menu.repository;

import com.metamorph.delivery.menu.entity.ModifierOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ModifierOptionRepository extends JpaRepository<ModifierOption, UUID> {
}

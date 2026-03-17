package com.metamorph.delivery.order.service;

import com.metamorph.delivery.order.dto.OrderPricing;
import com.metamorph.delivery.restaurant.entity.Restaurant;
import com.metamorph.delivery.user.entity.Address;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
public class PricingService {

    private static final BigDecimal BASE_DELIVERY_FEE = new BigDecimal("15.00");
    private static final BigDecimal PER_KM_FEE = new BigDecimal("5.00");
    private static final BigDecimal MIN_DELIVERY_FEE = new BigDecimal("15.00");
    private static final BigDecimal MAX_DELIVERY_FEE = new BigDecimal("60.00");
    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.10");
    private static final BigDecimal MAX_SERVICE_FEE = new BigDecimal("30.00");
    private static final BigDecimal VAT_RATE = new BigDecimal("0.15");

    /**
     * Calculate full order pricing given the subtotal, restaurant, delivery address, and optional promo code.
     */
    public OrderPricing calculateOrder(BigDecimal subtotal, Restaurant restaurant,
                                       Address deliveryAddress, String promoCode) {
        BigDecimal deliveryFee = calculateDeliveryFee(restaurant, deliveryAddress);
        BigDecimal serviceFee = calculateServiceFee(subtotal);
        BigDecimal discountTotal = calculateDiscount(subtotal, promoCode);
        BigDecimal taxableAmount = subtotal.add(serviceFee).subtract(discountTotal);
        BigDecimal taxTotal = taxableAmount.multiply(VAT_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal
                .add(deliveryFee)
                .add(serviceFee)
                .add(taxTotal)
                .subtract(discountTotal);

        return OrderPricing.builder()
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .serviceFee(serviceFee)
                .taxTotal(taxTotal)
                .discountTotal(discountTotal)
                .totalAmount(totalAmount)
                .build();
    }

    /**
     * Delivery fee: base R15 + R5/km, clamped between R15 and R60.
     */
    private BigDecimal calculateDeliveryFee(Restaurant restaurant, Address deliveryAddress) {
        double distance = calculateDistance(
                restaurant.getLatitude(), restaurant.getLongitude(),
                deliveryAddress.getLatitude(), deliveryAddress.getLongitude()
        );

        BigDecimal distanceFee = PER_KM_FEE.multiply(BigDecimal.valueOf(distance))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal fee = BASE_DELIVERY_FEE.add(distanceFee);

        if (fee.compareTo(MIN_DELIVERY_FEE) < 0) {
            fee = MIN_DELIVERY_FEE;
        }
        if (fee.compareTo(MAX_DELIVERY_FEE) > 0) {
            fee = MAX_DELIVERY_FEE;
        }

        return fee;
    }

    /**
     * Service fee: 10% of subtotal, capped at R30.
     */
    private BigDecimal calculateServiceFee(BigDecimal subtotal) {
        BigDecimal fee = subtotal.multiply(SERVICE_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        return fee.compareTo(MAX_SERVICE_FEE) > 0 ? MAX_SERVICE_FEE : fee;
    }

    /**
     * Calculate promo discount. Placeholder — validates promo codes and returns discount amount.
     */
    private BigDecimal calculateDiscount(BigDecimal subtotal, String promoCode) {
        if (promoCode == null || promoCode.isBlank()) {
            return BigDecimal.ZERO;
        }

        // TODO: Integrate with a proper promo/coupon service
        // For now, support a hardcoded test promo
        if ("WELCOME10".equalsIgnoreCase(promoCode)) {
            BigDecimal discount = subtotal.multiply(new BigDecimal("0.10")).setScale(2, RoundingMode.HALF_UP);
            BigDecimal maxDiscount = new BigDecimal("50.00");
            return discount.compareTo(maxDiscount) > 0 ? maxDiscount : discount;
        }

        log.warn("Invalid promo code used: {}", promoCode);
        return BigDecimal.ZERO;
    }

    /**
     * Haversine distance in km between two lat/lng points.
     * Returns 0 if coordinates are missing.
     */
    private double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 0.0;
        }

        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

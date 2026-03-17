package com.metamorph.delivery.config;

import com.metamorph.delivery.user.entity.Address;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.AddressRepository;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class DebugSeedController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    @GetMapping("/api/debug/seed-check")
    public Map<String, Object> seedCheck() {
        Map<String, Object> result = new LinkedHashMap<>();

        String email = "test@test.com";

        Optional<User> customerOpt = userRepository.findByEmail(email);

        result.put("customerExists", customerOpt.isPresent());

        if (customerOpt.isPresent()) {
            User customer = customerOpt.get();
            result.put("customerId", customer.getId());
            result.put("customerEmail", customer.getEmail());
            result.put("customerRole", customer.getRole());

            List<Address> addresses = addressRepository.findByUserId(customer.getId());
            result.put("addressCount", addresses.size());

            if (!addresses.isEmpty()) {
                Address address = addresses.get(0);
                result.put("addressExists", true);
                result.put("addressId", address.getId());
                result.put("addressLine1", address.getAddressLine1());
                result.put("city", address.getCity());
                result.put("addressUserId", address.getUser().getId());
                result.put("addressUserEmail", address.getUser().getEmail());
            } else {
                result.put("addressExists", false);
            }
        } else {
            result.put("addressExists", false);
        }

        return result;
    }
}
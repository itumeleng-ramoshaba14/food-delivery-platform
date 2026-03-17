package com.metamorph.delivery.auth.service;

import com.metamorph.delivery.auth.dto.*;
import com.metamorph.delivery.auth.security.JwtTokenProvider;
import com.metamorph.delivery.common.exception.DuplicateResourceException;
import com.metamorph.delivery.common.exception.ResourceNotFoundException;
import com.metamorph.delivery.common.exception.UnauthorizedException;
import com.metamorph.delivery.user.entity.User;
import com.metamorph.delivery.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final StringRedisTemplate redisTemplate;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Duration OTP_TTL = Duration.ofMinutes(5);

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .build();

        user = userRepository.save(user);
        log.info("New user registered: {} with role {}", user.getEmail(), user.getRole());

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .user(UserDTO.fromEntity(user))
                .build();
    }

    public void requestOtp(OtpRequest request) {
        String identifier = resolveOtpIdentifier(request);

        String otp = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        String redisKey = "otp:" + identifier;

        redisTemplate.opsForValue().set(redisKey, otp, OTP_TTL);
        log.info("OTP generated for {}: {}", identifier, otp);
        // TODO: Send OTP via SMS/email service
    }

    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String identifier = resolveOtpVerifyIdentifier(request);
        String redisKey = "otp:" + identifier;

        String storedOtp = redisTemplate.opsForValue().get(redisKey);
        if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        redisTemplate.delete(redisKey);

        User user;
        if (request.getPhone() != null) {
            user = userRepository.findByPhone(request.getPhone())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with this phone number"));
            user.setPhoneVerified(true);
        } else {
            user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with this email"));
            user.setEmailVerified(true);
        }

        userRepository.save(user);
        log.info("OTP verified for {}", identifier);

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .user(UserDTO.fromEntity(user))
                .build();
    }

    private String resolveOtpIdentifier(OtpRequest request) {
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            return request.getPhone();
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            return request.getEmail();
        }
        throw new IllegalArgumentException("Either phone or email must be provided");
    }

    private String resolveOtpVerifyIdentifier(OtpVerifyRequest request) {
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            return request.getPhone();
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            return request.getEmail();
        }
        throw new IllegalArgumentException("Either phone or email must be provided");
    }
}

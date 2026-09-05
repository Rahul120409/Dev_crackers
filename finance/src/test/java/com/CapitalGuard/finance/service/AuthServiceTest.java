package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.dto.AuthResponse;
import com.CapitalGuard.finance.dto.LoginRequest;
import com.CapitalGuard.finance.dto.RegisterRequest;
import com.CapitalGuard.finance.entity.User;
import com.CapitalGuard.finance.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenService jwtTokenService = new JwtTokenService();
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtTokenService, "secretKey", "Test_Secret_Key_For_Unit_Testing_12345");
        authService = new AuthService(userRepository, passwordEncoder, jwtTokenService);
    }

    @Test
    void testSuccessfulRegistration() {
        RegisterRequest request = RegisterRequest.builder()
                .username("risk_officer")
                .email("officer@capitalshield.com")
                .password("SecurePass123!")
                .fullName("Alex Morgan")
                .role("ROLE_RISK_MANAGER")
                .build();

        when(userRepository.existsByUsername("risk_officer")).thenReturn(false);
        when(userRepository.existsByEmail("officer@capitalshield.com")).thenReturn(false);

        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .username("risk_officer")
                .email("officer@capitalshield.com")
                .password(passwordEncoder.encode("SecurePass123!"))
                .fullName("Alex Morgan")
                .role("ROLE_RISK_MANAGER")
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse response = authService.register(request);

        assertTrue(response.isSuccess());
        assertNotNull(response.getToken());
        assertEquals("risk_officer", response.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testDuplicateUsernameRegistrationFails() {
        RegisterRequest request = RegisterRequest.builder()
                .username("existing_user")
                .email("new@capitalshield.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByUsername("existing_user")).thenReturn(true);

        AuthResponse response = authService.register(request);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("already taken"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testSuccessfulLogin() {
        String rawPassword = "StrongPassword99";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .username("risk_lead")
                .email("lead@capitalshield.com")
                .password(encodedPassword)
                .role("ROLE_RISK_MANAGER")
                .build();

        when(userRepository.findByUsername("risk_lead")).thenReturn(Optional.of(existingUser));

        LoginRequest loginRequest = LoginRequest.builder()
                .username("risk_lead")
                .password(rawPassword)
                .build();

        AuthResponse response = authService.login(loginRequest);

        assertTrue(response.isSuccess());
        assertNotNull(response.getToken());
        assertEquals("risk_lead", response.getUsername());
    }

    @Test
    void testInvalidPasswordLoginFails() {
        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .username("risk_lead")
                .email("lead@capitalshield.com")
                .password(passwordEncoder.encode("CorrectPassword"))
                .role("ROLE_RISK_MANAGER")
                .build();

        when(userRepository.findByUsername("risk_lead")).thenReturn(Optional.of(existingUser));

        LoginRequest loginRequest = LoginRequest.builder()
                .username("risk_lead")
                .password("WrongPassword")
                .build();

        AuthResponse response = authService.login(loginRequest);

        assertFalse(response.isSuccess());
        assertEquals("Invalid username or password.", response.getMessage());
        assertNull(response.getToken());
    }
}

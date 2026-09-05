package com.CapitalGuard.finance.service;

import com.CapitalGuard.finance.dto.AuthResponse;
import com.CapitalGuard.finance.dto.LoginRequest;
import com.CapitalGuard.finance.dto.RegisterRequest;
import com.CapitalGuard.finance.entity.User;
import com.CapitalGuard.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    /**
     * Registers a new user with encrypted password.
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Username '" + request.getUsername() + "' is already taken.")
                    .build();
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email '" + request.getEmail() + "' is already registered.")
                    .build();
        }

        String assignedRole = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole()
                : "ROLE_RISK_MANAGER";

        User user = User.builder()
                .username(request.getUsername().trim().toLowerCase())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(assignedRole)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtTokenService.generateToken(savedUser.getUsername(), savedUser.getRole());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole())
                .message("User registered successfully.")
                .build();
    }

    /**
     * Authenticates user via username or email and validates password.
     */
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim().toLowerCase();

        // Search by username or by email
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid username or password.")
                    .build();
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid username or password.")
                    .build();
        }

        String token = jwtTokenService.generateToken(user.getUsername(), user.getRole());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Login successful.")
                .build();
    }

    /**
     * Retrieves current logged in user from token.
     */
    public AuthResponse getCurrentUser(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtTokenService.validateToken(token)) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Invalid or expired session token.")
                    .build();
        }

        String username = jwtTokenService.extractUsername(token);
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return AuthResponse.builder()
                    .success(false)
                    .message("User not found.")
                    .build();
        }

        User user = userOpt.get();
        return AuthResponse.builder()
                .success(true)
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Session active.")
                .build();
    }
}

package com.CapitalGuard.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String token;
    private UUID userId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String message;
}

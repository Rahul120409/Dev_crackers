package com.CapitalGuard.finance.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Lightweight, cryptographically signed authentication token generator using HMAC-SHA256.
 * Completely self-contained without needing third-party JWT library version conflicts.
 */
@Service
public class JwtTokenService {

    private static final String HMAC_ALGO = "HmacSHA256";
    private static final long EXPIRATION_TIME_MS = 1000L * 60 * 60 * 24 * 7; // 7 days

    @Value("${app.security.jwt-secret:CapitalShield_FinTech_Super_Secret_Key_2026_Hackathon}")
    private String secretKey;

    /**
     * Generates a signed token: payload.signature
     */
    public String generateToken(String username, String role) {
        long expiry = System.currentTimeMillis() + EXPIRATION_TIME_MS;
        String payload = username + ":" + role + ":" + expiry;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedPayload);
        return encodedPayload + "." + signature;
    }

    /**
     * Validates that the token signature is intact and the token has not expired.
     */
    public boolean validateToken(String token) {
        if (token == null || !token.contains(".")) return false;
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 2) return false;

            String encodedPayload = parts[0];
            String providedSignature = parts[1];

            String expectedSignature = sign(encodedPayload);
            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                    providedSignature.getBytes(StandardCharsets.UTF_8))) {
                return false;
            }

            String payload = new String(Base64.getUrlDecoder().decode(encodedPayload), StandardCharsets.UTF_8);
            String[] payloadParts = payload.split(":");
            if (payloadParts.length < 3) return false;

            long expiry = Long.parseLong(payloadParts[2]);
            return System.currentTimeMillis() < expiry;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            return payload.split(":")[0];
        } catch (Exception e) {
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            String[] parts = token.split("\\.");
            String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            return payload.split(":")[1];
        } catch (Exception e) {
            return null;
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_ALGO);
            mac.init(secretKeySpec);
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate HMAC token signature", e);
        }
    }
}

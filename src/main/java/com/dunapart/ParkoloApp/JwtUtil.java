package com.dunapart.ParkoloApp;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {
    private static final String SECRET_KEY = "4gH7k9Z2L1dJ0xTpVfQm3WbYlE6sPzR5A8jKoBvXyCzD2FwTnSh3L0g9PzRkM1iQv5lS7UeYtFb4H3J0VzW8Kp9rCqMnQxLoYh2"; // Titkos kulcs don't share this (or what)
//    private static final String SECRET_KEY = "szupertitkoskulcs12"; // Titkos kulcs don't share this (or what)

    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 órás érvényesség (csak nem marad tovább bejelentkezve a batya, ha mégis akkor úgyis kidobja az oldal asszem)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

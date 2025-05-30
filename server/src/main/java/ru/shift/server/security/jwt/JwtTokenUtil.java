package ru.shift.server.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ru.shift.server.database.entity.user.UserRole;
import ru.shift.server.dto.request.RegisterRequest;

import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.lifetime}")
    private Duration jwtLifetime;

    public String generateToken(RegisterRequest registerRequest, UserRole role) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("role", role);
        claims.put("email", registerRequest.email());
        claims.put("login", registerRequest.login());
        claims.put("phone", registerRequest.phone());
        claims.put("fullName", registerRequest.fullName());

        Date issuedDate = new Date();
        Date expiryDate = new Date(issuedDate.getTime() + jwtLifetime.toMillis());

        return Jwts.builder()
                .claims(claims)
                .setIssuedAt(issuedDate)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


}

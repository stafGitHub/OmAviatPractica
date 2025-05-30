package ru.shift.server.services;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;
import ru.shift.server.database.entity.user.UserRole;
import ru.shift.server.security.jwt.JwtTokenUtil;
import ru.shift.server.security.jwt.UserJwtInfo;

@Service
@RequiredArgsConstructor
public class ThymeleafService {
    private final JwtTokenUtil jwtTokenUtil;

    public void htmlAddUserJwtInfo(ModelAndView modelAndView , String token) {
        if (token!=null) {
            Claims claims = jwtTokenUtil.getAllClaimsFromToken(token);

            UserJwtInfo userJwtInfo = UserJwtInfo.builder()
                    .email(claims.get("email", String.class))
                    .role(UserRole.valueOf(claims.get("role", String.class)))
                    .phone(claims.get("phone", String.class))
                    .login(claims.get("login", String.class))
                    .fullName(claims.get("fullName", String.class))
                    .flag(true)
                    .build();

            modelAndView.addObject("userJwtInfo", userJwtInfo);
        }else {
            UserJwtInfo userJwtInfo = UserJwtInfo.builder()
                    .flag(false)
                    .build();
            modelAndView.addObject("userJwtInfo", userJwtInfo);
        }
    }
}

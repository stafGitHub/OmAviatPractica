package ru.shift.server.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.shift.server.database.entity.user.UserRole;
import ru.shift.server.dto.request.LoginRequest;
import ru.shift.server.dto.request.OrderRequest;
import ru.shift.server.dto.request.RegisterRequest;
import ru.shift.server.dto.response.LoginResponse;
import ru.shift.server.dto.response.OrderResponse;
import ru.shift.server.dto.response.RegisterResponse;
import ru.shift.server.exception.UserNotFound;
import ru.shift.server.services.OrderService;
import ru.shift.server.services.UserServices;

@org.springframework.web.bind.annotation.RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestController {
    private final UserServices userServices;
    public final OrderService orderService;

    @PostMapping(value = "/register")
    public RegisterResponse registerEndpoint(@RequestBody RegisterRequest registerRequest,
                                             HttpServletResponse httpServletResponse) {
        var userJwtInfo = userServices.getUserJwtInfo(registerRequest, UserRole.USER);
        var cookie = new Cookie("token", userJwtInfo);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7 * 7);

        var saved = userServices.saveUserToDatabase(registerRequest, userJwtInfo);
        if (saved) {
            httpServletResponse.addCookie(cookie);
            return RegisterResponse.builder()
                    .success(true)
                    .token(userJwtInfo)
                    .build();
        } else {
            return RegisterResponse.builder()
                    .success(false)
                    .message("Email or Login already exists")
                    .build();
        }
    }

    @PostMapping("/order")
    public OrderResponse orderEndpoint(@RequestBody OrderRequest orderRequest) {
        orderService.saveOrder(orderRequest);

        return OrderResponse.builder()
                .success(true)
                .build();
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest, HttpServletResponse httpServletResponse) {
        try {
            var user = userServices.getUser(loginRequest);
            boolean isAdmin = user.getRole() == UserRole.ADMIN;

            var cookie = new Cookie("token", user.getToken());
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 7 * 7);

            httpServletResponse.addCookie(cookie);

            return LoginResponse.builder()
                    .success(true)
                    .isAdmin(isAdmin)
                    .token(user.getToken())
                    .build();
        } catch (UserNotFound e) {
            return LoginResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
        }
    }
}

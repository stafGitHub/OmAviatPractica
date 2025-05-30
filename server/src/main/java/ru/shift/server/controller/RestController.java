package ru.shift.server.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.shift.server.database.entity.user.UserRole;
import ru.shift.server.dto.request.OrderRequest;
import ru.shift.server.dto.request.RegisterRequest;
import ru.shift.server.dto.response.OrderResponse;
import ru.shift.server.dto.response.RegisterResponse;
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
        var saved = userServices.saveUserToDatabase(registerRequest);
        if (saved) {
            var userJwtInfo = userServices.getUserJwtInfo(registerRequest, UserRole.USER);
            var cookie = new Cookie("token", userJwtInfo);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24 * 7 * 7);

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
}

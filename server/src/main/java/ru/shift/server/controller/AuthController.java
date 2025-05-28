package ru.shift.server.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.shift.server.dto.request.RequestRegister;
import ru.shift.server.services.UserServices;

@RestController
@RequestMapping("/mineIsNotMyself")
@RequiredArgsConstructor
public class AuthController {
    private final UserServices userServices;

    @GetMapping("/register")
    public HttpStatus registerEndpoint(RequestRegister requestRegister, HttpServletResponse response) {
        var saved = userServices.saveUserToDatabase(requestRegister);
        if (saved) {
            return HttpStatus.OK;
        } else {
            return HttpStatus.BAD_REQUEST;
        }
    }
}

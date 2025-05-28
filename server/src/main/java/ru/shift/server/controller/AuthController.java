package ru.shift.server.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.shift.server.dto.request.RequestRegister;

@RestController
@RequestMapping("/mineIsNotMyself")
public class AuthController {

    @PostMapping()
    public RequestRegister registerEndpoint(RequestRegister requestRegister) {
        return requestRegister;
    }
}

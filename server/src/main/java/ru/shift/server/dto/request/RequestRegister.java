package ru.shift.server.dto.request;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class RequestRegister {
    private final String name;
    private final String lastName;
    private final String email;
    private final String login;
    private final String password;
}

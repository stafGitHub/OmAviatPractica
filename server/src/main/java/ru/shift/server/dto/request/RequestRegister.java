package ru.shift.server.dto.request;

public record RequestRegister(String fullName, String phone, String email,
                              String login, String password) {
}

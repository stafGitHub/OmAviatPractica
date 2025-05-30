package ru.shift.server.dto.request;

public record RegisterRequest(String fullName, String phone, String email,
                              String login, String password) {
}

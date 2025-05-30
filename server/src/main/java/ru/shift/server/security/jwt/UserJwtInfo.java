package ru.shift.server.security.jwt;

import lombok.Builder;
import ru.shift.server.database.entity.UserRole;

@Builder
public record UserJwtInfo(String fullName, String phone, String email,
                          String login, UserRole role , boolean flag) {
}

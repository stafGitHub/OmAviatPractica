package ru.shift.server.dto.response;

import lombok.Builder;

@Builder
public record LoginResponse(boolean success, String message , String token , boolean isAdmin) {
}

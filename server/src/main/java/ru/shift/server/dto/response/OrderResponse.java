package ru.shift.server.dto.response;

import lombok.Builder;

@Builder
public record OrderResponse(boolean success, String message) {
}

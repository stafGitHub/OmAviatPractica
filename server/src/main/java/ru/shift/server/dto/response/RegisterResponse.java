package ru.shift.server.dto.response;

import lombok.Builder;

@Builder
public record RegisterResponse(boolean success, String message , String token){
}

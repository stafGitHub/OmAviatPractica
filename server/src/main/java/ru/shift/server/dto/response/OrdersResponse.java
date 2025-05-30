package ru.shift.server.dto.response;

import lombok.Builder;
import ru.shift.server.dto.OrderOutput;

import java.util.List;

@Builder
public record OrdersResponse(List<OrderOutput> orders) {
}

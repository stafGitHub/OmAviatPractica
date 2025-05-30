package ru.shift.server.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.shift.server.database.entity.order.Order;
import ru.shift.server.database.entity.order.PaymentMethod;
import ru.shift.server.database.entity.order.TypeOfService;
import ru.shift.server.database.repository.OrderRepository;
import ru.shift.server.dto.request.OrderRequest;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public void saveOrder(OrderRequest orderRequest) {
        orderRepository.save(mapOrder(orderRequest));
    }

    private Order mapOrder(OrderRequest orderRequest) {
        return Order.builder()
                .address(orderRequest.address())
                .time(orderRequest.time())
                .paymentMethod(PaymentMethod.valueOf(orderRequest.payment()))
                .date(orderRequest.date())
                .typeOfService(TypeOfService.valueOf(orderRequest.service()))
                .build();
    }
}

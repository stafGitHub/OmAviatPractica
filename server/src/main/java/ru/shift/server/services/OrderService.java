package ru.shift.server.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.shift.server.database.entity.order.Order;
import ru.shift.server.database.repository.OrderRepository;
import ru.shift.server.dto.OrderOutput;
import ru.shift.server.dto.request.OrderRequest;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public void saveOrder(OrderRequest orderRequest) {
        orderRepository.save(mapOrder(orderRequest));
    }

    public List<OrderOutput> getAllOrders() {
        var all = orderRepository.findAll();
        ArrayList<OrderOutput> orderOutputs = new ArrayList<>();
        for (Order order : all) {
            orderOutputs.add(OrderOutput.builder()
                    .id(order.getId())
                    .fio(order.getFullName())
                    .phone(order.getNumber())
                    .service(order.getTypeOfService())
                    .date(order.getDate())
                    .status(order.getStatus())
                    .address(order.getAddress())
                    .description(order.getPaymentMethod())
                    .build());
        }
        return orderOutputs;
    }

    private Order mapOrder(OrderRequest orderRequest) {
        return Order.builder()
                .address(orderRequest.address())
                .time(orderRequest.time())
                .paymentMethod(orderRequest.payment())
                .date(orderRequest.date())
                .typeOfService((orderRequest.service()))
                .build();
    }
}

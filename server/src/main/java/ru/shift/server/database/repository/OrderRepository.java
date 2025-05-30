package ru.shift.server.database.repository;

import org.springframework.data.repository.CrudRepository;
import ru.shift.server.database.entity.order.Order;

public interface OrderRepository extends CrudRepository<Order, Long> {
}

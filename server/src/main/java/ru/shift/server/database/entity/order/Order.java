package ru.shift.server.database.entity.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "address")
    private String address;
    @Column(name = "number")
    private String number;
    @Column(name = "desired_date")
    private String date;
    @Column(name = "desired_time")
    private String time;
    @Column(name = "type_of_service")
    private String typeOfService;
    @Column(name = "payment_method")
    private String paymentMethod;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "status")
    private String status;
}

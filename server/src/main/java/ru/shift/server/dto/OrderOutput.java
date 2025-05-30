package ru.shift.server.dto;

import lombok.Builder;

import java.io.Serializable;

@Builder
public record OrderOutput(Long id, String fio, String phone,
                          String service, String date, String status,
                          String address, String description) implements Serializable {
}
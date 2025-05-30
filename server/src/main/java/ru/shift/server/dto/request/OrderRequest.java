package ru.shift.server.dto.request;

public record OrderRequest(String address, String phone, String date, String time,
                           String service , String payment) {
}

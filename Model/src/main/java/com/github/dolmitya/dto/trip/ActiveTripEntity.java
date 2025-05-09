package com.github.dolmitya.dto.trip;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActiveTripEntity {
    private Long tripId;
    private Long scooterId;
    private String scooterModel;
    private LocalDateTime startTime;
    private Double startLatitude;
    private Double startLongitude;
    private Double pricePerMinute;
    private Double price;
}

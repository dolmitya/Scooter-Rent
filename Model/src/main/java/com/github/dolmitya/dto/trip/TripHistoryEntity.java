package com.github.dolmitya.dto.trip;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class TripHistoryEntity {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double distance;
    private Double pricePerMinute;
    private String scooterModel;
    private Long scooterId;
    private Double price;
}

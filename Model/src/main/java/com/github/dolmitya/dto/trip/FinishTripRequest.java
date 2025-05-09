package com.github.dolmitya.dto.trip;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FinishTripRequest {
    private Long tripId;
    private LocalDateTime endTime;
    private Double endLatitude;
    private Double endLongitude;
}

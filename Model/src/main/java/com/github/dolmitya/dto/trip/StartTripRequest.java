package com.github.dolmitya.dto.trip;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StartTripRequest {
    private Long scooterId;
    private LocalDateTime startTime;
}

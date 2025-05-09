package com.github.dolmitya.dto.trip;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TimeRequest {
    private LocalDateTime now;
}

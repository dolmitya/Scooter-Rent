package com.github.dolmitya.dto.scooter;

import lombok.Data;

@Data
public class CreateScooterRequest {
    private String model;
    private Double latitude;
    private Double longitude;
    private Double pricePerMinute;
}

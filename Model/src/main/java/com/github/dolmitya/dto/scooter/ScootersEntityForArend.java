package com.github.dolmitya.dto.scooter;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ScootersEntityForArend {
    private Long id;
    private String model;
    private Double latitude;
    private Double longitude;
    private Double pricePerMinute;
}

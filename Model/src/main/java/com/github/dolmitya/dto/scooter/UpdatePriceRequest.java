package com.github.dolmitya.dto.scooter;

import lombok.Data;

@Data
public class UpdatePriceRequest {
    private String model;
    private Double newPrice;
}

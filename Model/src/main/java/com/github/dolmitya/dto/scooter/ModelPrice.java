package com.github.dolmitya.dto.scooter;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ModelPrice {
    private String model;
    private double price;
}

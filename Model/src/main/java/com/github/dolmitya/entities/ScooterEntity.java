package com.github.dolmitya.entities;

import com.github.dolmitya.enums.ScooterStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Collection;

@Entity
@Data
@Table(name="scooters")
public class ScooterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model")
    private String model;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScooterStatus status;

    @Column(name = "price_per_minute")
    private Double pricePerMinute;

    @OneToMany(mappedBy = "scooter", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<TripEntity> trips;
}
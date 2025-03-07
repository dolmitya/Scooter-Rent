package com.github.dolmitya.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
public class UserEntity {
    public UserEntity(String username, String password) {
        super();
        this.username = username;
        this.password = password;
        this.balance = 0.0;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "number_phone")
    private String numberPhone;

    @Column(name = "balance")
    private Double balance;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<TripEntity> trips;
}

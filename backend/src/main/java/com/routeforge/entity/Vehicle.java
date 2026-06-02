package com.routeforge.entity;

import com.routeforge.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licensePlate;

    private String model;

    private String make;

    @Column(name = "vehicle_year")
    private Integer year;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    private Double capacity;
}

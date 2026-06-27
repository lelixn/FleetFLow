package com.routeforge.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String startLocation;

    private String endLocation;

    private Double estimatedDistance;

    private LocalDateTime scheduledTime;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Transient
    private Long driverId;

    @Transient
    private Long vehicleId;

    @JsonProperty("driverId")
    public Long getDriverId() {
        if (driverId != null) return driverId;
        return driver != null ? driver.getId() : null;
    }

    @JsonProperty("vehicleId")
    public Long getVehicleId() {
        if (vehicleId != null) return vehicleId;
        return vehicle != null ? vehicle.getId() : null;
    }
}

package com.routeforge.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.routeforge.enums.DeliveryStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    private String recipientName;

    private String address;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    private LocalDateTime scheduledTime;

    private LocalDateTime deliveredTime;

    @Transient
    private Long routeId;

    @JsonProperty("routeId")
    public Long getRouteId() {
        if (routeId != null) return routeId;
        return route != null ? route.getId() : null;
    }
}

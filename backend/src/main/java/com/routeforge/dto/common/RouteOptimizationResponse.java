package com.routeforge.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteOptimizationResponse {
    private List<String> optimizedRoute;
    private Double estimatedDistance;
    private Double estimatedTimeMinutes;
}

package com.routeforge.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteOptimizationRequest {
    private List<String> locations;
    private String vehicleId;
}

package com.routeforge.dto;

public record AnalyticsSummary(
        long vehicles,
        long availableVehicles,
        long drivers,
        long availableDrivers,
        long routes,
        long deliveries,
        long pending,
        long inTransit,
        long delivered
) {}


package com.routeforge.service.impl;

import com.routeforge.dto.AnalyticsSummary;
import com.routeforge.entity.Vehicle;
import com.routeforge.enums.DeliveryStatus;
import com.routeforge.enums.VehicleStatus;
import com.routeforge.entity.Driver;
import com.routeforge.entity.Route;
import com.routeforge.entity.Delivery;
import com.routeforge.repository.DeliveryRepository;
import com.routeforge.repository.DriverRepository;
import com.routeforge.repository.RouteRepository;
import com.routeforge.repository.VehicleRepository;
import com.routeforge.service.analytics.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final DeliveryRepository deliveryRepository;

    @Override
    public AnalyticsSummary getSummary() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Driver> drivers = driverRepository.findAll();
        List<Route> routes = routeRepository.findAll();
        List<Delivery> deliveries = deliveryRepository.findAll();

        long availableVehicles = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count();
        long availableDrivers = drivers.stream().filter(Driver::getAvailable).count();

        long pending = deliveries.stream().filter(d -> d.getStatus() == DeliveryStatus.PENDING).count();
        long inTransit = deliveries.stream().filter(d -> d.getStatus() == DeliveryStatus.IN_TRANSIT).count();
        long delivered = deliveries.stream().filter(d -> d.getStatus() == DeliveryStatus.DELIVERED).count();

        return new AnalyticsSummary(
                vehicles.size(),
                availableVehicles,
                drivers.size(),
                availableDrivers,
                routes.size(),
                deliveries.size(),
                pending,
                inTransit,
                delivered
        );
    }
}

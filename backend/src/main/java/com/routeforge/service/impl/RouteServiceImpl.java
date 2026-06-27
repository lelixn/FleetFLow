package com.routeforge.service.impl;

import com.routeforge.entity.Driver;
import com.routeforge.entity.Route;
import com.routeforge.entity.Vehicle;
import com.routeforge.exception.ResourceNotFoundException;
import com.routeforge.repository.DriverRepository;
import com.routeforge.repository.RouteRepository;
import com.routeforge.repository.VehicleRepository;
import com.routeforge.service.route.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Override
    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
    }

    @Override
    public Route createRoute(Route route) {
        applyRelations(route);
        return routeRepository.save(route);
    }

    @Override
    public Route updateRoute(Long id, Route details) {
        Route route = getRouteById(id);
        if (details.getName() != null) route.setName(details.getName());
        if (details.getStartLocation() != null) route.setStartLocation(details.getStartLocation());
        if (details.getEndLocation() != null) route.setEndLocation(details.getEndLocation());
        if (details.getEstimatedDistance() != null) route.setEstimatedDistance(details.getEstimatedDistance());
        if (details.getScheduledTime() != null) route.setScheduledTime(details.getScheduledTime());
        if (details.getDriverId() != null || details.getDriver() != null) {
            route.setDriver(resolveDriver(details));
        }
        if (details.getVehicleId() != null || details.getVehicle() != null) {
            route.setVehicle(resolveVehicle(details));
        }
        return routeRepository.save(route);
    }

    @Override
    public void deleteRoute(Long id) {
        Route route = getRouteById(id);
        routeRepository.delete(route);
    }

    private void applyRelations(Route route) {
        route.setDriver(resolveDriver(route));
        route.setVehicle(resolveVehicle(route));
    }

    private Driver resolveDriver(Route route) {
        if (route.getDriverId() != null) {
            return driverRepository.findById(route.getDriverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + route.getDriverId()));
        }
        return route.getDriver();
    }

    private Vehicle resolveVehicle(Route route) {
        if (route.getVehicleId() != null) {
            return vehicleRepository.findById(route.getVehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + route.getVehicleId()));
        }
        return route.getVehicle();
    }
}

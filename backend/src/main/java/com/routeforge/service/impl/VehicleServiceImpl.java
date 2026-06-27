package com.routeforge.service.impl;

import com.routeforge.entity.Vehicle;
import com.routeforge.exception.ResourceNotFoundException;
import com.routeforge.repository.VehicleRepository;
import com.routeforge.service.vehicle.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Vehicle updateVehicle(Long id, Vehicle details) {
        Vehicle vehicle = getVehicleById(id);
        if (details.getLicensePlate() != null) vehicle.setLicensePlate(details.getLicensePlate());
        if (details.getMake() != null) vehicle.setMake(details.getMake());
        if (details.getModel() != null) vehicle.setModel(details.getModel());
        if (details.getYear() != null) vehicle.setYear(details.getYear());
        if (details.getStatus() != null) vehicle.setStatus(details.getStatus());
        if (details.getCapacity() != null) vehicle.setCapacity(details.getCapacity());
        return vehicleRepository.save(vehicle);
    }

    @Override
    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
}

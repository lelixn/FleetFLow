package com.routeforge.service.impl;

import com.routeforge.entity.Driver;
import com.routeforge.exception.ResourceNotFoundException;
import com.routeforge.repository.DriverRepository;
import com.routeforge.service.driver.DriverService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    @Override
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Override
    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
    }

    @Override
    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    @Override
    public Driver updateDriver(Long id, Driver details) {
        Driver driver = getDriverById(id);
        if (details.getFirstName() != null) driver.setFirstName(details.getFirstName());
        if (details.getLastName() != null) driver.setLastName(details.getLastName());
        if (details.getLicenseNumber() != null) driver.setLicenseNumber(details.getLicenseNumber());
        if (details.getPhone() != null) driver.setPhone(details.getPhone());
        if (details.getAvailable() != null) driver.setAvailable(details.getAvailable());
        return driverRepository.save(driver);
    }

    @Override
    public void deleteDriver(Long id) {
        Driver driver = getDriverById(id);
        driverRepository.delete(driver);
    }
}

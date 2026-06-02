package com.routeforge.service.driver;

import com.routeforge.entity.Driver;
import java.util.List;

public interface DriverService {
    List<Driver> getAllDrivers();
    Driver getDriverById(Long id);
    Driver createDriver(Driver driver);
    Driver updateDriver(Long id, Driver driver);
    void deleteDriver(Long id);
}

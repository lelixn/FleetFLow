package com.routeforge.config;

import com.routeforge.entity.Delivery;
import com.routeforge.entity.Driver;
import com.routeforge.entity.Route;
import com.routeforge.entity.User;
import com.routeforge.entity.Vehicle;
import com.routeforge.enums.DeliveryStatus;
import com.routeforge.enums.Role;
import com.routeforge.enums.VehicleStatus;
import com.routeforge.repository.DeliveryRepository;
import com.routeforge.repository.DriverRepository;
import com.routeforge.repository.RouteRepository;
import com.routeforge.repository.UserRepository;
import com.routeforge.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.datasource.url:}")
    private String dataSourceUrl;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled) return;
        // Only seed the in-memory demo DB so production remains safe.
        if (dataSourceUrl == null || !dataSourceUrl.contains("h2:mem")) return;
        if (vehicleRepository.count() > 0L) return;

        // Users
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@fleetflow.local");
        admin.setPassword(passwordEncoder.encode("Admin123!"));
        admin.setRole(Role.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);

        User dUser1 = new User();
        dUser1.setUsername("driver1");
        dUser1.setEmail("driver1@fleetflow.local");
        dUser1.setPassword(passwordEncoder.encode("Driver123!"));
        dUser1.setRole(Role.DRIVER);
        dUser1.setActive(true);
        userRepository.save(dUser1);

        User dUser2 = new User();
        dUser2.setUsername("driver2");
        dUser2.setEmail("driver2@fleetflow.local");
        dUser2.setPassword(passwordEncoder.encode("Driver123!"));
        dUser2.setRole(Role.DRIVER);
        dUser2.setActive(true);
        userRepository.save(dUser2);

        // Drivers
        Driver driver1 = new Driver();
        driver1.setFirstName("Asha");
        driver1.setLastName("Kumar");
        driver1.setPhone("+91 90000 11111");
        driver1.setLicenseNumber("LIC-1001");
        driver1.setAvailable(true);
        driver1.setUser(dUser1);
        driverRepository.save(driver1);

        Driver driver2 = new Driver();
        driver2.setFirstName("Rahul");
        driver2.setLastName("Shetty");
        driver2.setPhone("+91 90000 22222");
        driver2.setLicenseNumber("LIC-1002");
        driver2.setAvailable(false);
        driver2.setUser(dUser2);
        driverRepository.save(driver2);

        // Vehicles
        Vehicle v1 = new Vehicle();
        v1.setLicensePlate("KA-01-FF-1001");
        v1.setMake("Mercedes");
        v1.setModel("Sprinter");
        v1.setYear(2024);
        v1.setStatus(VehicleStatus.AVAILABLE);
        v1.setCapacity(12.0);
        vehicleRepository.save(v1);

        Vehicle v2 = new Vehicle();
        v2.setLicensePlate("KA-01-FF-1002");
        v2.setMake("Volvo");
        v2.setModel("FMX");
        v2.setYear(2023);
        v2.setStatus(VehicleStatus.IN_SERVICE);
        v2.setCapacity(8.0);
        vehicleRepository.save(v2);

        // Routes
        LocalDateTime now = LocalDateTime.now();
        Route r1 = new Route();
        r1.setName("Route A");
        r1.setStartLocation("Bangalore");
        r1.setEndLocation("Mysore");
        r1.setEstimatedDistance(148.5);
        r1.setScheduledTime(now.plusHours(2));
        r1.setVehicle(v1);
        r1.setDriver(driver1);
        routeRepository.save(r1);

        Route r2 = new Route();
        r2.setName("Route B");
        r2.setStartLocation("Mysore");
        r2.setEndLocation("Mangalore");
        r2.setEstimatedDistance(365.0);
        r2.setScheduledTime(now.plusHours(5));
        r2.setVehicle(v2);
        r2.setDriver(driver2);
        routeRepository.save(r2);

        // Deliveries
        Delivery del1 = new Delivery();
        del1.setRoute(r1);
        del1.setRecipientName("Ravi");
        del1.setAddress("MG Road, Bengaluru");
        del1.setStatus(DeliveryStatus.PENDING);
        del1.setScheduledTime(now.plusHours(2));
        del1.setDeliveredTime(null);
        deliveryRepository.save(del1);

        Delivery del2 = new Delivery();
        del2.setRoute(r1);
        del2.setRecipientName("Meena");
        del2.setAddress("Hebbal, Bengaluru");
        del2.setStatus(DeliveryStatus.IN_TRANSIT);
        del2.setScheduledTime(now.plusHours(2));
        del2.setDeliveredTime(null);
        deliveryRepository.save(del2);

        Delivery del3 = new Delivery();
        del3.setRoute(r2);
        del3.setRecipientName("Suresh");
        del3.setAddress("Hampankatta, Mangalore");
        del3.setStatus(DeliveryStatus.DELIVERED);
        del3.setScheduledTime(now.plusHours(5));
        del3.setDeliveredTime(now.plusHours(10));
        deliveryRepository.save(del3);

        Delivery del4 = new Delivery();
        del4.setRoute(r2);
        del4.setRecipientName("Nisha");
        del4.setAddress("Kuvempunagar, Mysore");
        del4.setStatus(DeliveryStatus.PENDING);
        del4.setScheduledTime(now.plusHours(5));
        del4.setDeliveredTime(null);
        deliveryRepository.save(del4);

        Delivery del5 = new Delivery();
        del5.setRoute(r2);
        del5.setRecipientName("Prakash");
        del5.setAddress("Airport Road, Mangalore");
        del5.setStatus(DeliveryStatus.FAILED);
        del5.setScheduledTime(now.plusHours(5));
        del5.setDeliveredTime(now.plusHours(8));
        deliveryRepository.save(del5);
    }
}


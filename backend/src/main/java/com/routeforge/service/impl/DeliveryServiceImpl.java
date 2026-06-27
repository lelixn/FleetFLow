package com.routeforge.service.impl;

import com.routeforge.entity.Delivery;
import com.routeforge.entity.Route;
import com.routeforge.enums.DeliveryStatus;
import com.routeforge.exception.BadRequestException;
import com.routeforge.exception.ResourceNotFoundException;
import com.routeforge.repository.DeliveryRepository;
import com.routeforge.repository.RouteRepository;
import com.routeforge.service.delivery.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final RouteRepository routeRepository;

    @Override
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    @Override
    public Delivery getDeliveryById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery not found with id: " + id));
    }

    @Override
    public Delivery createDelivery(Delivery delivery) {
        if (delivery.getStatus() == null) {
            delivery.setStatus(DeliveryStatus.PENDING);
        }
        delivery.setRoute(resolveRoute(delivery));
        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery updateDelivery(Long id, Delivery details) {
        Delivery delivery = getDeliveryById(id);
        if (details.getRecipientName() != null) delivery.setRecipientName(details.getRecipientName());
        if (details.getAddress() != null) delivery.setAddress(details.getAddress());
        if (details.getScheduledTime() != null) delivery.setScheduledTime(details.getScheduledTime());
        if (details.getRouteId() != null || details.getRoute() != null) {
            delivery.setRoute(resolveRoute(details));
        }
        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery updateStatus(Long id, DeliveryStatus status) {
        Delivery delivery = getDeliveryById(id);
        validateStatusTransition(delivery.getStatus(), status);
        delivery.setStatus(status);
        if (status == DeliveryStatus.DELIVERED) {
            delivery.setDeliveredTime(LocalDateTime.now());
        } else if (status == DeliveryStatus.PENDING || status == DeliveryStatus.IN_TRANSIT) {
            delivery.setDeliveredTime(null);
        }
        return deliveryRepository.save(delivery);
    }

    @Override
    public void deleteDelivery(Long id) {
        Delivery delivery = getDeliveryById(id);
        deliveryRepository.delete(delivery);
    }

    private Route resolveRoute(Delivery delivery) {
        if (delivery.getRouteId() != null) {
            return routeRepository.findById(delivery.getRouteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + delivery.getRouteId()));
        }
        return delivery.getRoute();
    }

    private void validateStatusTransition(DeliveryStatus current, DeliveryStatus next) {
        if (current == next) return;
        if (current == DeliveryStatus.DELIVERED || current == DeliveryStatus.FAILED) {
            throw new BadRequestException("Cannot change status from " + current);
        }
        if (current == DeliveryStatus.PENDING && next != DeliveryStatus.IN_TRANSIT && next != DeliveryStatus.FAILED) {
            throw new BadRequestException("Pending delivery can only move to IN_TRANSIT or FAILED");
        }
        if (current == DeliveryStatus.IN_TRANSIT && next != DeliveryStatus.DELIVERED && next != DeliveryStatus.FAILED) {
            throw new BadRequestException("In-transit delivery can only move to DELIVERED or FAILED");
        }
    }
}

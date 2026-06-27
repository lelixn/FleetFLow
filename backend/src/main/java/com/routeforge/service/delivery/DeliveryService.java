package com.routeforge.service.delivery;

import com.routeforge.entity.Delivery;
import com.routeforge.enums.DeliveryStatus;

import java.util.List;

public interface DeliveryService {
    List<Delivery> getAllDeliveries();
    Delivery getDeliveryById(Long id);
    Delivery createDelivery(Delivery delivery);
    Delivery updateDelivery(Long id, Delivery details);
    Delivery updateStatus(Long id, DeliveryStatus status);
    void deleteDelivery(Long id);
}

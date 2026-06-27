package com.routeforge.controller.delivery;

import com.routeforge.entity.Delivery;
import com.routeforge.enums.DeliveryStatus;
import com.routeforge.service.delivery.DeliveryService;
import com.routeforge.util.ApiResponse;
import com.routeforge.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(Constants.API_VERSION + "/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Delivery>>> getAllDeliveries() {
        List<Delivery> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(ApiResponse.success(deliveries, "Deliveries retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Delivery>> getDeliveryById(@PathVariable Long id) {
        Delivery delivery = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(ApiResponse.success(delivery, "Delivery retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Delivery>> createDelivery(@RequestBody Delivery delivery) {
        Delivery created = deliveryService.createDelivery(delivery);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Delivery created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Delivery>> updateDelivery(@PathVariable Long id, @RequestBody Delivery delivery) {
        Delivery updated = deliveryService.updateDelivery(id, delivery);
        return ResponseEntity.ok(ApiResponse.success(updated, "Delivery updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Delivery>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, DeliveryStatus> body) {
        DeliveryStatus status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("status is required"));
        }
        Delivery updated = deliveryService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Delivery status updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDelivery(@PathVariable Long id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Delivery deleted successfully"));
    }
}

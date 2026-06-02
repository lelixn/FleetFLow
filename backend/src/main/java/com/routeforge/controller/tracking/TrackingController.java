package com.routeforge.controller.tracking;

import com.routeforge.entity.Tracking;
import com.routeforge.service.tracking.TrackingService;
import com.routeforge.util.ApiResponse;
import com.routeforge.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(Constants.API_VERSION + "/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Tracking>>> getAllTrackings() {
        List<Tracking> trackings = trackingService.getAllTrackings();
        return ResponseEntity.ok(ApiResponse.success(trackings, "Trackings retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Tracking>> getTrackingById(@PathVariable Long id) {
        Tracking tracking = trackingService.getTrackingById(id);
        return ResponseEntity.ok(ApiResponse.success(tracking, "Tracking retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Tracking>> createTracking(@RequestBody Tracking tracking) {
        Tracking createdTracking = trackingService.createTracking(tracking);
        return ResponseEntity.ok(ApiResponse.success(createdTracking, "Tracking created successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTracking(@PathVariable Long id) {
        trackingService.deleteTracking(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Tracking deleted successfully"));
    }
}

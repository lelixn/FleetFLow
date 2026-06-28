package com.routeforge.controller.analytics;

import com.routeforge.dto.common.EtaPredictionRequest;
import com.routeforge.dto.common.EtaPredictionResponse;
import com.routeforge.dto.common.RouteOptimizationRequest;
import com.routeforge.dto.common.RouteOptimizationResponse;
import com.routeforge.service.analytics.AIMLService;
import com.routeforge.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AI/ML", description = "AI/ML powered features for Route Optimization")
public class AIMLController {

    private final AIMLService aimlService;

    @PostMapping("/optimize-route")
    @Operation(summary = "Optimize a route using AI/ML")
    public ApiResponse<RouteOptimizationResponse> optimizeRoute(@RequestBody RouteOptimizationRequest request) {
        RouteOptimizationResponse response = aimlService.optimizeRoute(request);
        return ApiResponse.success(response, "Route optimized successfully");
    }

    @PostMapping("/predict-eta")
    @Operation(summary = "Predict ETA using AI/ML")
    public ApiResponse<EtaPredictionResponse> predictEta(@RequestBody EtaPredictionRequest request) {
        EtaPredictionResponse response = aimlService.predictEta(request);
        return ApiResponse.success(response, "ETA predicted successfully");
    }
}

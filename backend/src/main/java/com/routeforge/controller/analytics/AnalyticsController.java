package com.routeforge.controller.analytics;

import com.routeforge.dto.AnalyticsSummary;
import com.routeforge.service.analytics.AnalyticsService;
import com.routeforge.util.ApiResponse;
import com.routeforge.util.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(Constants.API_VERSION + "/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummary>> summary() {
        AnalyticsSummary summary = analyticsService.getSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "Analytics summary retrieved successfully"));
    }
}

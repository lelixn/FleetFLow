package com.routeforge.service.analytics;

import com.routeforge.dto.common.EtaPredictionRequest;
import com.routeforge.dto.common.EtaPredictionResponse;
import com.routeforge.dto.common.RouteOptimizationRequest;
import com.routeforge.dto.common.RouteOptimizationResponse;

public interface AIMLService {
    RouteOptimizationResponse optimizeRoute(RouteOptimizationRequest request);
    EtaPredictionResponse predictEta(EtaPredictionRequest request);
}

package com.routeforge.controller.health;

import com.routeforge.util.ApiResponse;
import com.routeforge.util.Constants;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(Constants.API_VERSION + "/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Void>> health() {
        // Intentionally simple: if the server is up, this will respond with 200.
        return ResponseEntity.ok(ApiResponse.success(null, "OK"));
    }
}


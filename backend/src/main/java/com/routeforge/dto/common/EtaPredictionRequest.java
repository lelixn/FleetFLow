package com.routeforge.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtaPredictionRequest {
    private String routeId;
    private Double currentLat;
    private Double currentLng;
}

package com.routeforge.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EtaPredictionResponse {
    private Integer etaMinutes;
    private String status;
}

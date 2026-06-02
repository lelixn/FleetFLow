package com.routeforge.service.impl;

import com.routeforge.entity.Tracking;
import com.routeforge.exception.ResourceNotFoundException;
import com.routeforge.repository.TrackingRepository;
import com.routeforge.service.tracking.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrackingServiceImpl implements TrackingService {

    private final TrackingRepository trackingRepository;

    @Override
    public List<Tracking> getAllTrackings() {
        return trackingRepository.findAll();
    }

    @Override
    public Tracking getTrackingById(Long id) {
        return trackingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tracking not found with id: " + id));
    }

    @Override
    public Tracking createTracking(Tracking tracking) {
        return trackingRepository.save(tracking);
    }

    @Override
    public void deleteTracking(Long id) {
        Tracking tracking = getTrackingById(id);
        trackingRepository.delete(tracking);
    }
}

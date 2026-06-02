package com.routeforge.service.tracking;

import com.routeforge.entity.Tracking;
import java.util.List;

public interface TrackingService {
    List<Tracking> getAllTrackings();
    Tracking getTrackingById(Long id);
    Tracking createTracking(Tracking tracking);
    void deleteTracking(Long id);
}

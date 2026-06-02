package com.routeforge.service.route;

import com.routeforge.entity.Route;
import java.util.List;

public interface RouteService {
    List<Route> getAllRoutes();
    Route getRouteById(Long id);
    Route createRoute(Route route);
    Route updateRoute(Long id, Route route);
    void deleteRoute(Long id);
}

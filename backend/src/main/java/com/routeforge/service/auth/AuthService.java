package com.routeforge.service.auth;

import com.routeforge.dto.request.LoginRequest;
import com.routeforge.dto.request.SignupRequest;
import com.routeforge.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    void signup(SignupRequest request);
}

package com.TITAN.THRONE.Personal_Finance_Coach.config;

import com.TITAN.THRONE.Personal_Finance_Coach.service.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtAuthFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        // 1️⃣ Skip JWT check for public auth endpoints
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = resolveToken(request);

            // 2️⃣ Only proceed if token exists, is valid, and no auth is already set
            if (jwt != null && tokenProvider.validateToken(jwt)
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                Authentication auth = tokenProvider.getAuthentication(jwt);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        } catch (JwtException | IllegalArgumentException ex) {
            // 3️⃣ Invalid or expired token — clear context and optionally log
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return; // Stop filter chain if token is invalid
        }

        // 4️⃣ Proceed with the rest of the chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extracts the JWT token from Authorization header (Bearer scheme)
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
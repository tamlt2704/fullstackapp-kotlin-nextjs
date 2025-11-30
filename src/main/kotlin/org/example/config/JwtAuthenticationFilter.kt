package org.example.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.example.service.JwtService
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            
            if (jwtService.isTokenValid(token)) {
                val username = jwtService.extractUsername(token)
                val role = jwtService.extractRole(token)
                
                val authorities = listOf(SimpleGrantedAuthority("ROLE_$role"))
                val authentication = UsernamePasswordAuthenticationToken(username, null, authorities)
                SecurityContextHolder.getContext().authentication = authentication
            }
        }
        
        filterChain.doFilter(request, response)
    }
}
package org.example.service

import org.example.dto.AuthResponse
import org.example.dto.LoginRequest
import org.example.dto.RegisterRequest
import org.example.entity.Role
import org.example.entity.User
import org.example.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByUsername(request.username)) {
            return AuthResponse("Username already exists", false)
        }
        
        val user = User(
            username = request.username,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )
        userRepository.save(user)
        return AuthResponse("User registered successfully")
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByUsername(request.username)
            ?: return AuthResponse("Invalid credentials", false)
        
        if (!passwordEncoder.matches(request.password, user.password)) {
            return AuthResponse("Invalid credentials", false)
        }
        
        return AuthResponse("Login successful")
    }
}
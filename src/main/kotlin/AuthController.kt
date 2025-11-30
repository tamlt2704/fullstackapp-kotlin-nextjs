package org.example

import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<String> {
        if (userRepository.findByUsername(request.username) != null) {
            return ResponseEntity.badRequest().body("Username already exists")
        }
        
        val user = User(
            username = request.username,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )
        userRepository.save(user)
        return ResponseEntity.ok("User registered successfully")
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<String> {
        val user = userRepository.findByUsername(request.username)
            ?: return ResponseEntity.badRequest().body("Invalid credentials")
        
        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity.badRequest().body("Invalid credentials")
        }
        
        return ResponseEntity.ok("Login successful")
    }
}

data class RegisterRequest(val username: String, val password: String)
data class LoginRequest(val username: String, val password: String)
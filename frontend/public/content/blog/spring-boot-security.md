---
title: "Spring Boot Security with JWT"
date: "2024-11-28"
category: "Backend"
tags: ["Spring Boot", "Security", "JWT", "Kotlin"]
---

# Spring Boot Security with JWT

*Published on November 28, 2024*

## Overview

Implementing JWT authentication in Spring Boot provides stateless security for modern web applications.

## Dependencies

```kotlin
implementation("org.springframework.boot:spring-boot-starter-security")
implementation("io.jsonwebtoken:jjwt-api:0.12.3")
implementation("io.jsonwebtoken:jjwt-impl:0.12.3")
implementation("io.jsonwebtoken:jjwt-jackson:0.12.3")
```

## JWT Service

```kotlin
@Service
class JwtService {
    @Value("\${jwt.secret}")
    private lateinit var secret: String
    
    private val secretKey by lazy { Keys.hmacShaKeyFor(secret.toByteArray()) }
    
    fun generateToken(username: String, roles: List<String>): String {
        return Jwts.builder()
            .subject(username)
            .claim("roles", roles)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + 86400000))
            .signWith(secretKey)
            .compact()
    }
    
    fun extractUsername(token: String): String {
        return extractClaims(token).subject
    }
    
    fun validateToken(token: String, username: String): Boolean {
        return extractUsername(token) == username && !isTokenExpired(token)
    }
    
    private fun extractClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
    
    private fun isTokenExpired(token: String): Boolean {
        return extractClaims(token).expiration.before(Date())
    }
}
```

## Security Configuration

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthenticationFilter,
    private val authenticationProvider: AuthenticationProvider
) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }
            .authorizeHttpRequests { auth ->
                auth.requestMatchers("/api/auth/**", "/h2-console/**").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
            .build()
    }
    
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:3000")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
    
    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
    
    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
        return config.authenticationManager
    }
}
```

## JWT Authentication Filter

```kotlin
@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userDetailsService: UserDetailsService
) : OncePerRequestFilter() {
    
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }
        
        val jwt = authHeader.substring(7)
        val username = jwtService.extractUsername(jwt)
        
        if (SecurityContextHolder.getContext().authentication == null) {
            val userDetails = userDetailsService.loadUserByUsername(username)
            
            if (jwtService.validateToken(jwt, username)) {
                val authToken = UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.authorities
                )
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
        }
        
        filterChain.doFilter(request, response)
    }
}
```

## Password Encoding

```kotlin
@Service
class UserService(private val passwordEncoder: PasswordEncoder) {
    
    fun registerUser(username: String, password: String): User {
        val encodedPassword = passwordEncoder.encode(password)
        return userRepository.save(User(username, encodedPassword))
    }
    
    fun validatePassword(rawPassword: String, encodedPassword: String): Boolean {
        return passwordEncoder.matches(rawPassword, encodedPassword)
    }
}
```

## Role-Based Access Control

```kotlin
@RestController
@RequestMapping("/api")
class SecureController {
    
    @GetMapping("/user/profile")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    fun getUserProfile(): ResponseEntity<Profile> {
        return ResponseEntity.ok(profileService.getProfile())
    }
    
    @DeleteMapping("/admin/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Void> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }
    
    @GetMapping("/public/info")
    fun getPublicInfo(): ResponseEntity<String> {
        return ResponseEntity.ok("Public information")
    }
}
```

## Security Best Practices

### 1. Store Secrets Securely
```properties
# application.properties
jwt.secret=${JWT_SECRET:your-256-bit-secret-key-here}
jwt.expiration=86400000
```

### 2. Use Strong Password Encoding
- Always use BCryptPasswordEncoder with strength 10+
- Never store plain text passwords
- Implement password complexity requirements

### 3. Implement Token Refresh
```kotlin
fun generateRefreshToken(username: String): String {
    return Jwts.builder()
        .subject(username)
        .issuedAt(Date())
        .expiration(Date(System.currentTimeMillis() + 604800000)) // 7 days
        .signWith(secretKey)
        .compact()
}
```

### 4. Handle Authentication Exceptions
```kotlin
@ControllerAdvice
class SecurityExceptionHandler {
    
    @ExceptionHandler(BadCredentialsException::class)
    fun handleBadCredentials(ex: BadCredentialsException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ErrorResponse("Invalid credentials"))
    }
    
    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDenied(ex: AccessDeniedException): ResponseEntity<ErrorResponse> {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ErrorResponse("Access denied"))
    }
}
```

### 5. Enable Method Security
```kotlin
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
class MethodSecurityConfig
```

## Common Pitfalls

1. **Weak Secret Keys**: Use at least 256-bit keys
2. **No Token Expiration**: Always set expiration times
3. **Ignoring CORS**: Configure properly for frontend integration
4. **Missing CSRF Protection**: Disable only for stateless APIs
5. **Hardcoded Credentials**: Use environment variables

## Benefits

- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Secure**: Cryptographically signed tokens
- **Flexible**: Include custom claims and roles
- **Performance**: Reduced database lookups
- **Mobile-Friendly**: Easy to implement in mobile apps

## Conclusion

JWT with Spring Boot Security provides a robust, scalable authentication solution. Combine it with proper password encoding, role-based access control, and security best practices for production-ready applications.
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
```

## JWT Service

```kotlin
@Service
class JwtService {
    private val secretKey = Keys.hmacShaKeyFor("secret".toByteArray())
    
    fun generateToken(username: String): String {
        return Jwts.builder()
            .subject(username)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + 86400000))
            .signWith(secretKey)
            .compact()
    }
}
```

## Security Configuration

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth.requestMatchers("/api/auth/**").permitAll()
                    .anyRequest().authenticated()
            }
            .build()
    }
}
```

## Benefits

- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Secure**: Cryptographically signed tokens
- **Flexible**: Include custom claims

## Conclusion

JWT with Spring Boot Security provides a robust authentication solution for modern applications.
---
title: "Next.js Protected Routes with Spring Boot Authentication - Complete Guide"
date: "2024-12-13"
category: "Full Stack Development"
tags: ["Next.js", "Spring Boot", "Authentication", "JWT", "Role-Based Access"]
---

# Next.js Protected Routes with Spring Boot Authentication

Complete guide from beginner to professional for implementing protected routes in Next.js with Kotlin Spring Boot backend authentication and role-based access control.

## Overview

**What You'll Learn:**
- JWT authentication flow between Next.js and Spring Boot
- Protected routes with middleware
- Role-based access control (RBAC)
- Session management
- Refresh token handling
- Server and client-side protection

---

## Part 1: Spring Boot Backend (Beginner)

### 1.1 Basic JWT Authentication

```kotlin
// build.gradle.kts
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("io.jsonwebtoken:jjwt-api:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")
}

// User Entity
@Entity
@Table(name = "users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(unique = true, nullable = false)
    val email: String,
    
    @Column(nullable = false)
    val password: String,
    
    @Enumerated(EnumType.STRING)
    val role: Role = Role.USER
)

enum class Role {
    USER, ADMIN, MODERATOR
}

// JWT Service
@Service
class JwtService {
    @Value("\${jwt.secret}")
    private lateinit var secret: String
    
    @Value("\${jwt.expiration:3600000}") // 1 hour
    private val expiration: Long = 3600000
    
    fun generateToken(email: String, role: Role): String {
        return Jwts.builder()
            .subject(email)
            .claim("role", role.name)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact()
    }
    
    fun extractEmail(token: String): String {
        return extractClaim(token) { it.subject }
    }
    
    fun extractRole(token: String): String {
        return extractClaim(token) { it["role"] as String }
    }
    
    fun isTokenValid(token: String): Boolean {
        return try {
            !isTokenExpired(token)
        } catch (e: Exception) {
            false
        }
    }
    
    private fun <T> extractClaim(token: String, claimsResolver: (Claims) -> T): T {
        val claims = extractAllClaims(token)
        return claimsResolver(claims)
    }
    
    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .payload
    }
    
    private fun isTokenExpired(token: String): Boolean {
        return extractClaim(token) { it.expiration }.before(Date())
    }
    
    private fun getSigningKey(): SecretKey {
        return Keys.hmacShaKeyFor(secret.toByteArray())
    }
}

// Auth Controller
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {
    
    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> {
        if (userRepository.existsByEmail(request.email)) {
            return ResponseEntity.badRequest().build()
        }
        
        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.USER
        )
        userRepository.save(user)
        
        val token = jwtService.generateToken(user.email, user.role)
        return ResponseEntity.ok(AuthResponse(token, user.email, user.role.name))
    }
    
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        
        val user = userRepository.findByEmail(request.email)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        
        val token = jwtService.generateToken(user.email, user.role)
        return ResponseEntity.ok(AuthResponse(token, user.email, user.role.name))
    }
    
    @GetMapping("/me")
    fun getCurrentUser(@RequestHeader("Authorization") authHeader: String): ResponseEntity<UserResponse> {
        val token = authHeader.removePrefix("Bearer ")
        val email = jwtService.extractEmail(token)
        val role = jwtService.extractRole(token)
        
        return ResponseEntity.ok(UserResponse(email, role))
    }
}

data class RegisterRequest(val email: String, val password: String)
data class LoginRequest(val email: String, val password: String)
data class AuthResponse(val token: String, val email: String, val role: String)
data class UserResponse(val email: String, val role: String)
```

**Explanation:**
- `JwtService`: Creates and validates JWT tokens with email and role claims
- `AuthController`: Handles registration, login, and user info endpoints
- Tokens expire after 1 hour (configurable)

---

### 1.2 Security Configuration

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) {
    
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers("/api/moderator/**").hasAnyRole("ADMIN", "MODERATOR")
                    .anyRequest().authenticated()
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter::class.java)
        
        return http.build()
    }
    
    @Bean
    fun jwtAuthenticationFilter(): JwtAuthenticationFilter {
        return JwtAuthenticationFilter(jwtService, userRepository)
    }
    
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:3000")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
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

// JWT Filter
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
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
        
        val token = authHeader.substring(7)
        
        try {
            if (jwtService.isTokenValid(token)) {
                val email = jwtService.extractEmail(token)
                val user = userRepository.findByEmail(email)
                
                if (user != null) {
                    val authorities = listOf(SimpleGrantedAuthority("ROLE_${user.role.name}"))
                    val authentication = UsernamePasswordAuthenticationToken(
                        user.email,
                        null,
                        authorities
                    )
                    SecurityContextHolder.getContext().authentication = authentication
                }
            }
        } catch (e: Exception) {
            logger.error("JWT validation failed", e)
        }
        
        filterChain.doFilter(request, response)
    }
}
```

**Explanation:**
- `SecurityConfig`: Configures which endpoints require authentication and roles
- `JwtAuthenticationFilter`: Validates JWT on every request and sets Spring Security context
- CORS enabled for Next.js frontend (localhost:3000)

---

## Part 2: Next.js Frontend (Intermediate)

### 2.1 Auth Context and API Client

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error('Failed to get user');
  return res.json();
}

// Context
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      getCurrentUser(storedToken)
        .then(userData => {
          setUser(userData);
          setToken(storedToken);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const data = await login(email, password);
    setToken(data.token);
    setUser({ email: data.email, role: data.role });
    localStorage.setItem('token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login: handleLogin, logout: handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Explanation:**
- `AuthContext`: Manages authentication state globally
- Token stored in localStorage for persistence
- Auto-loads user on app start if token exists

---

### 2.2 Middleware for Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
```

**Explanation:**
- Runs on server before page loads
- Redirects unauthenticated users to login
- Redirects authenticated users away from login/register

---

### 2.3 Client-Side Route Protection

```typescript
// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
    
    if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

// Usage in pages
// app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard Content</div>
    </ProtectedRoute>
  );
}

// app/admin/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div>Admin Panel</div>
    </ProtectedRoute>
  );
}
```

**Explanation:**
- `ProtectedRoute`: Wrapper component for protected pages
- Checks authentication and role on client-side
- Redirects if unauthorized

---

## Part 3: Advanced Features (Professional)

### 3.1 Refresh Token Implementation

```kotlin
// Spring Boot - Refresh Token
@Entity
data class RefreshToken(
    @Id @GeneratedValue
    val id: Long = 0,
    
    @Column(unique = true)
    val token: String,
    
    @ManyToOne
    val user: User,
    
    val expiryDate: Instant
)

@Service
class RefreshTokenService(
    private val refreshTokenRepository: RefreshTokenRepository,
    private val userRepository: UserRepository
) {
    fun createRefreshToken(email: String): RefreshToken {
        val user = userRepository.findByEmail(email) ?: throw Exception("User not found")
        
        val token = RefreshToken(
            token = UUID.randomUUID().toString(),
            user = user,
            expiryDate = Instant.now().plusSeconds(604800) // 7 days
        )
        
        return refreshTokenRepository.save(token)
    }
    
    fun verifyExpiration(token: RefreshToken): RefreshToken {
        if (token.expiryDate.isBefore(Instant.now())) {
            refreshTokenRepository.delete(token)
            throw Exception("Refresh token expired")
        }
        return token
    }
}

@PostMapping("/refresh")
fun refreshToken(@RequestBody request: RefreshTokenRequest): ResponseEntity<AuthResponse> {
    val refreshToken = refreshTokenRepository.findByToken(request.refreshToken)
        ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
    
    refreshTokenService.verifyExpiration(refreshToken)
    
    val user = refreshToken.user
    val newAccessToken = jwtService.generateToken(user.email, user.role)
    
    return ResponseEntity.ok(AuthResponse(newAccessToken, user.email, user.role.name))
}
```

```typescript
// Next.js - Auto Refresh
let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  if (refreshPromise) return refreshPromise;
  
  refreshPromise = fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('token', data.token);
      return data.token;
    })
    .finally(() => {
      refreshPromise = null;
    });
  
  return refreshPromise;
}

// Axios interceptor for auto-refresh
import axios from 'axios';

const api = axios.create({ baseURL: API_URL });

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const newToken = await refreshAccessToken(refreshToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (e) {
          // Refresh failed, logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Explanation:**
- Refresh tokens last 7 days vs access tokens (1 hour)
- Auto-refresh on 401 errors prevents user logout
- Prevents multiple simultaneous refresh requests

---

### 3.2 Role-Based UI Components

```typescript
// components/RoleGuard.tsx
'use client';

import { useAuth } from '@/lib/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

// Usage
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <RoleGuard allowedRoles={['ADMIN', 'MODERATOR']}>
        <button>Delete User</button>
      </RoleGuard>
      
      <RoleGuard allowedRoles={['ADMIN']}>
        <button>System Settings</button>
      </RoleGuard>
    </div>
  );
}
```

---

### 3.3 Server-Side Protection (App Router)

```typescript
// lib/auth-server.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getServerSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getServerSession();
  
  if (!user) {
    redirect('/login');
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  
  return user;
}

// Usage in Server Component
// app/admin/page.tsx
import { requireAuth } from '@/lib/auth-server';

export default async function AdminPage() {
  const user = await requireAuth(['ADMIN']);
  
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
}
```

**Explanation:**
- Server-side authentication for App Router
- No client-side flash of protected content
- Better SEO and security

---

## Complete Flow Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Next.js   │         │ Spring Boot  │         │  Database   │
│   Client    │         │   Backend    │         │             │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │ 1. POST /auth/login   │                        │
       │──────────────────────>│                        │
       │   {email, password}   │                        │
       │                       │ 2. Verify credentials  │
       │                       │───────────────────────>│
       │                       │                        │
       │                       │ 3. User data           │
       │                       │<───────────────────────│
       │                       │                        │
       │ 4. JWT + Refresh Token│                        │
       │<──────────────────────│                        │
       │                       │                        │
       │ 5. Store tokens       │                        │
       │ (localStorage/cookie) │                        │
       │                       │                        │
       │ 6. GET /api/data      │                        │
       │ Authorization: Bearer │                        │
       │──────────────────────>│                        │
       │                       │ 7. Validate JWT        │
       │                       │ Check role             │
       │                       │                        │
       │ 8. Protected data     │                        │
       │<──────────────────────│                        │
       │                       │                        │
       │ 9. Token expired      │                        │
       │ (401 Unauthorized)    │                        │
       │<──────────────────────│                        │
       │                       │                        │
       │ 10. POST /auth/refresh│                        │
       │ {refreshToken}        │                        │
       │──────────────────────>│                        │
       │                       │                        │
       │ 11. New JWT           │                        │
       │<──────────────────────│                        │
       │                       │                        │
       │ 12. Retry request     │                        │
       │──────────────────────>│                        │
```

---

## Best Practices

1. **Token Storage**
   - Use httpOnly cookies for production (prevents XSS)
   - localStorage acceptable for development
   - Never store tokens in regular cookies without httpOnly

2. **Security**
   - Always use HTTPS in production
   - Implement rate limiting on auth endpoints
   - Add CSRF protection for cookie-based auth
   - Validate tokens on every request

3. **User Experience**
   - Show loading states during auth checks
   - Implement auto-refresh before token expires
   - Provide clear error messages
   - Remember user preference (remember me)

4. **Performance**
   - Cache user data in context
   - Use middleware for route protection
   - Implement token refresh in background
   - Minimize API calls

---

## Resources

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

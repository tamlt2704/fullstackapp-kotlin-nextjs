package org.example.entity

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(unique = true)
    val username: String,
    
    val password: String,
    
    @Enumerated(EnumType.STRING)
    val role: Role
)

enum class Role {
    USER, ADMIN
}
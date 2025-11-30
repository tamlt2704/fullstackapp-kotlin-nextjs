package org.example.dto

import org.example.entity.Role

data class UserDto(
    val id: Long,
    val username: String,
    val role: Role
)
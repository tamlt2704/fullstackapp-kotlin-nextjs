package org.example.service

import org.example.dto.UserDto
import org.example.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {

    fun getAllUsers(): List<UserDto> {
        return userRepository.findAll().map { user ->
            UserDto(
                id = user.id,
                username = user.username,
                role = user.role
            )
        }
    }
}
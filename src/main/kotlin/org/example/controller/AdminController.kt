package org.example.controller

import org.example.dto.UserDto
import org.example.service.UserService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin")
class AdminController(private val userService: UserService) {

    @GetMapping("/users")
    fun getAllUsers(): List<UserDto> {
        return userService.getAllUsers()
    }
}
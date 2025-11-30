package org.example.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloController {

    @GetMapping("/")
    fun home(): String = "Hello World!"

    @GetMapping("/hello")
    fun hello(): String = "Hello World!"
}
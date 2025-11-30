package org.example

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloController {

    @GetMapping("/")
    fun home(): String {
        return "Hello World!"
    }

    @GetMapping("/hello")
    fun hello(): String {
        return "Hello World!"
    }
}
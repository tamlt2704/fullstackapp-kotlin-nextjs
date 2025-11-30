package org.example

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

// @WebMvcTest loads only web layer components for testing
// HelloController::class specifies which controller to test
// Provides MockMvc for simulating HTTP requests without starting full server
@WebMvcTest(HelloController::class)
class HelloControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Test
    fun `should return hello world for root endpoint`() {
        // Test GET / returns "Hello World!"
        mockMvc.perform(get("/"))
            .andExpect(status().isOk)
            .andExpect(content().string("Hello World!"))
    }

    @Test
    fun `should return hello world for hello endpoint`() {
        // Test GET /hello returns "Hello World!"
        mockMvc.perform(get("/hello"))
            .andExpect(status().isOk)
            .andExpect(content().string("Hello World!"))
    }
}
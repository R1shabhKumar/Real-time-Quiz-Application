package com.example.quizapp.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.quizapp.model.User;
import com.example.quizapp.service.AuthService;

import java.util.Map;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        User user = authService.login(email, password);
        if (user != null) {
            return ResponseEntity.ok(Map.of("message", "Login successful", "user", user));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        boolean success = authService.register(email, password);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "Registration successful"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Registration failed"));
        }
    }
}
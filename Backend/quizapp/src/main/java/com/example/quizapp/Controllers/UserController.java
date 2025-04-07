package com.example.quizapp.Controllers;



import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.quizapp.model.User;
import com.example.quizapp.service.UserService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> joinQuiz(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String username = payload.get("username");
        User user = userService.joinQuiz(code, username);
        if (user != null) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Joined quiz successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Quiz not found"));
        }
    }

    @PostMapping("/update-score")
    public ResponseEntity<?> updateScore(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String quizCode = (String) payload.get("quizCode");
        int score = (int) payload.get("score");
        userService.updateScore(username, quizCode, score > 0);
        return ResponseEntity.ok(Map.of("message", "Score updated successfully"));
    }




}

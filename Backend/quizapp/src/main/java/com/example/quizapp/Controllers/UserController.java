package com.example.quizapp.Controllers;



import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quizapp.model.User;
import com.example.quizapp.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

   /*  @PostMapping("/join")
    public ResponseEntity<?> joinQuiz(@RequestParam String code, @RequestParam String username) {
        User user = userService.joinQuiz(code, username);
        if (user != null) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Joined quiz successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Quiz not found"));
        }
    } */
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




}

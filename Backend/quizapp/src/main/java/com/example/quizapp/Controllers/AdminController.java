package com.example.quizapp.Controllers;



import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.service.AdminService;
import com.example.quizapp.service.QuizService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private QuizService quizService;

    @PostMapping("/quiz/create")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz createdQuiz1 = quizService.createQuiz(quiz); //for setting the unique value of the quiz
        Quiz createdQuiz2 = adminService.createQuiz(createdQuiz1);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuiz2);
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getQuizzes() {
        List<Quiz> quizzes = adminService.getAllQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping("/quiz/update")
    public ResponseEntity<Quiz> updateQuiz(@RequestBody Quiz quiz) {
        Quiz updatedQuiz = adminService.updateQuiz(quiz);
        return ResponseEntity.ok(updatedQuiz);
    }

    @GetMapping("/quiz/delete")
    public ResponseEntity<?> deleteQuiz(@RequestParam int id) {
        adminService.deleteQuiz(id);
        return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestParam String password) {
        boolean isLoggedIn = adminService.loginAdmin(password);
        if (isLoggedIn) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Logged in successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid password"));
        }
    }
}


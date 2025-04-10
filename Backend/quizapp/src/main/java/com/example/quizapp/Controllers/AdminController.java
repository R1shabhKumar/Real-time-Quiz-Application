package com.example.quizapp.Controllers;



import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.service.AdminService;
import com.example.quizapp.service.QuizDataService;
import com.example.quizapp.service.QuizService;
import com.example.quizapp.service.UserService;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private QuizService quizService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private UserService userService;
    @Autowired
    private QuizDataService quizDataService;;

    @PostMapping("/quiz/create")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz createdQuiz1 = quizService.createQuiz(quiz); //for setting the unique value of the quiz
        Quiz createdQuiz2 = adminService.createQuiz(createdQuiz1);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdQuiz2);
    }


    @PostMapping("/quizzes")
    public ResponseEntity<List<Quiz>> getQuizzes(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        List<Quiz> quizzes = adminService.getAllQuizzes().stream()
                .filter(quiz -> quiz.getCreatedByEmail() != null && quiz.getCreatedByEmail().equals(email))
                .toList();
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
    /* 
    @MessageMapping("leaderboard/{quizCode}")
    public void getLeaderboard(@RequestParam String quizCode) {
        List<Map.Entry<String, Integer>> leaderboard = userService.getLeaderboard(quizCode);
        messagingTemplate.convertAndSend("/topic/leaderboard/" + quizCode, leaderboard);
    }   */

    @GetMapping("/leaderboard/{quizId}")
    public ResponseEntity<?> getLeaderboard(@PathVariable String quizId) {
        return ResponseEntity.ok(Map.of(
            "players", userService.getLeaderboard(quizId),
            "activeUsers", quizDataService.getUserCount(quizId),
            "timeLeft", 0 // Placeholder for time left
        ));
    }

    @MessageMapping("/scores/{quizId}")
    public void sendLeaderboard(@DestinationVariable String quizId) {
        List<Map.Entry<String, Integer>> leaderboard = userService.getLeaderboard(quizId);
        messagingTemplate.convertAndSend("/topic/scores/" + quizId, Map.of("players", leaderboard));
    }

    @Scheduled(fixedRate = 5000) // Runs every 2 seconds
    public void autoSendLeaderboards() {
        // Fetch all quizzes (or filter based on your requirements)
        List<Quiz> allQuizzes = quizService.getAllQuizzes();

        for (Quiz quiz : allQuizzes) {
            String quizId = String.valueOf(quiz.getCode());
            List<Map.Entry<String, Integer>> leaderboard = userService.getLeaderboard(quizId);

            // Send leaderboard updates for each quiz
            messagingTemplate.convertAndSend("/topic/scores/" + quizId, Map.of("players", leaderboard));
        }
    }
}


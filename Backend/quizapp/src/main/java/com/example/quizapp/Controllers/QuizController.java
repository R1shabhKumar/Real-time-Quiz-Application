package com.example.quizapp.Controllers;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.quizapp.DTO.QuizResponseDTO;
import com.example.quizapp.DTO.SubmitAnswerRequest;
import com.example.quizapp.model.Quiz;
import com.example.quizapp.service.QuizService;
import com.example.quizapp.service.UserService;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    @GetMapping("/get")
    public ResponseEntity<?> getQuiz(@RequestParam String code) {
        Quiz quiz = quizService.getQuizByCode(code);
        if (quiz != null) {
            return ResponseEntity.ok(quiz);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quiz not found"));
        }
    }

    @GetMapping("/getQuiz")
    public ResponseEntity<?> getQuizWithoutAnswers(@RequestParam String code) {
        Quiz quiz = quizService.getQuizByCode(code);
        if (quiz != null) {
            // Map Quiz to QuizResponseDTO
            QuizResponseDTO quizResponse = new QuizResponseDTO(
                quiz.getId(),
                quiz.getCode(),
                quiz.getTitle(),
                quiz.getQuestions().stream()
                    .map(question -> new QuizResponseDTO.QuestionDTO(
                        question.getId(),
                        question.getText(),
                        question.getOptions(),
                        question.getTimeLimit() // Removed trailing comma here
                    ))
                    .collect(Collectors.toList())
            );
            return ResponseEntity.ok(quizResponse);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quiz not found"));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswer(
            @RequestBody SubmitAnswerRequest request) {
        try {
            boolean isCorrect = quizService.checkAnswer(request.getCode(), request.getQuestionId(), request.getAnswer());
            
            userService.updateScore(request.getUsername(), request.getCode(), isCorrect); //update the user's score.
            return ResponseEntity.ok(Map.of("correct", isCorrect));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
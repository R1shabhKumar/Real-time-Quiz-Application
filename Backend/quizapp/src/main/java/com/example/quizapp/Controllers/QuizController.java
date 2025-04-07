package com.example.quizapp.Controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.quizapp.DTO.QuizResponseDTO;
import com.example.quizapp.DTO.SubmitAnswerRequest;
import com.example.quizapp.model.Question;
import com.example.quizapp.model.Quiz;
import com.example.quizapp.service.QuizService;
import com.example.quizapp.service.UserService;

@RestController
@CrossOrigin("http://localhost:5173")
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
                quiz.getCreatedByEmail(),
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

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String createdByEmail = (String) payload.get("createdByEmail");
        List<Map<String, Object>> questionPayloads = (List<Map<String, Object>>) payload.get("questions");

        // Map the incoming payload to a List<Question>
        List<Question> questions = questionPayloads.stream().map(q -> {
            Question question = new Question();
            question.setText((String) q.get("question"));
            question.setOptions((List<String>) q.get("options"));
            question.setCorrectAnswer((String) q.get("correctAnswer"));
            question.setTimeLimit((Integer) q.get("timeLimit"));
            return question;
        }).collect(Collectors.toList());

        Quiz quiz = new Quiz();
        quiz.setTitle(title); //set the creator's email
        quiz.setCreatedByEmail(createdByEmail);
        quiz.setQuestions(questions); // Set the mapped questions
        Quiz createdQuiz = quizService.createQuiz(quiz);

        return ResponseEntity.status(200).body(Map.of("message", "Quiz created successfully", "quizId", createdQuiz.getId()));
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<?> editQuiz(@PathVariable int quizId, @RequestBody Quiz quiz) {
        quiz.setId(quizId);
        Quiz updatedQuiz = quizService.updateQuiz(quiz);
        return ResponseEntity.ok(Map.of("message", "Quiz updated successfully"));
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuizDetails(@PathVariable String quizId) {
        Quiz quiz = quizService.getQuizByCode(quizId);
        if (quiz != null) {
            QuizResponseDTO response = new QuizResponseDTO(
                quiz.getId(),
                quiz.getCode(),
                quiz.getTitle(),
                quiz.getCreatedByEmail(),
                quiz.getQuestions().stream()
                    .map(q -> new QuizResponseDTO.QuestionDTO(q.getId(), q.getText(), q.getOptions(), q.getTimeLimit()))
                    .collect(Collectors.toList())
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Quiz not found"));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/validate-quiz")
    public ResponseEntity<?> validateQuiz(@RequestParam String quizId) {
        boolean exists = quizService.getQuizByCode(quizId) != null;
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/get-questions")
    public ResponseEntity<?> getQuestions(@RequestParam String quizId) {
        Quiz quiz = quizService.getQuizByCode(quizId);
        if (quiz != null) {
            return ResponseEntity.ok(quiz.getQuestions());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Quiz not found"));
        }
    }
}
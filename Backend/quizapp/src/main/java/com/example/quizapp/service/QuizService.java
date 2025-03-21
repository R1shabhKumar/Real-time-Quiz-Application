package com.example.quizapp.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quizapp.model.Question;
import com.example.quizapp.model.Quiz;
import com.example.quizapp.repository.QuizRepository;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizDataService quizDataService;  // Inject the new service
   // @Autowired
   // private WebSocketService webSocketService;

    public Quiz createQuiz(Quiz quiz) {
        String code = generateUniqueCode();
        quiz.setCode(code);
        return quizRepository.save(quiz);
    }

    public Quiz getQuizByCode(String code) {
        return quizRepository.findByCode(code);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz updateQuiz(Quiz quiz) {
        Optional<Quiz> quizOptional = quizRepository.findById(quiz.getId());
        if(quizOptional.isPresent()){
            Quiz existingQuiz = quizOptional.get();
            existingQuiz.setTitle(quiz.getTitle());
            existingQuiz.setQuestions(quiz.getQuestions());
            return quizRepository.save(existingQuiz);
        }
        return null;
    }

    public void deleteQuiz(int id) {
        quizRepository.deleteById(id);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (quizRepository.existsByCode(code)); // Ensure code is unique
        return code;
    }

    private String generateRandomCode() {
        // Generate a random 6-character alphanumeric code
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

    public boolean checkAnswer(String code, int questionId, String answer) {
        Quiz quiz = quizRepository.findByCode(code);
        if (quiz == null) {
            throw new IllegalArgumentException("Quiz not found");
        }

        Question question = null;
        for (Question q : quiz.getQuestions()) {
            if (q.getId() == questionId) {
                question = q;
                break;
            }
        }

        if (question == null) {
            throw new IllegalArgumentException("Question not found");
        }

        return question.getCorrectAnswer().equalsIgnoreCase(answer);
    }

     // Methods to track and get user counts  --  REMOVED from QuizService
    public void incrementUserCount(String code) {
        quizDataService.incrementUserCount(code);
    //    webSocketService.sendUserCountsToAdmin();
    }

    public void decrementUserCount(String code) {
        quizDataService.decrementUserCount(code);
    //    webSocketService.sendUserCountsToAdmin();
    }

    public Map<String, Integer> getUserCounts() {
        return quizDataService.getUserCounts();
    }
}


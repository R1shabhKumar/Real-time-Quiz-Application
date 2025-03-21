package com.example.quizapp.service;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private QuizRepository quizRepository;

    // Hardcoded admin password for MVP
    private final String ADMIN_PASSWORD = "admin";

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
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

    public boolean loginAdmin(String password) {
        return ADMIN_PASSWORD.equals(password);
    }
}

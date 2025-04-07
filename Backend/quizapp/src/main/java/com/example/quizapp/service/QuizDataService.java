package com.example.quizapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.repository.QuizRepository;

@Service
public class QuizDataService {

    @Autowired
    private QuizRepository quizRepository;

    // Consider also injecting the UserRepository if needed here

    public Quiz getQuizByCode(String code) {
        return quizRepository.findByCode(code);
    }

    public int getUserCount(String code) {
        Quiz quiz = quizRepository.findByCode(code); 
        int userCounts = quiz.getUserCount();
        
        return userCounts;
    }

    public void incrementUserCount(String code) {
        Quiz quiz = quizRepository.findByCode(code);
        if (quiz != null) {
           //quiz.setUserCount(quiz.getUserCount() + 1); //No setter, correct way below
            quizRepository.save(quiz); // Save the change
        }
    }

    public void decrementUserCount(String code) {
        Quiz quiz = quizRepository.findByCode(code);
         if (quiz != null) {
            //quiz.setUserCount(Math.max(0, quiz.getUserCount() - 1));
             quizRepository.save(quiz);
        }
    }
}
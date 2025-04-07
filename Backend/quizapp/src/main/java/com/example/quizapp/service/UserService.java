package com.example.quizapp.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.quizapp.model.Quiz;
import com.example.quizapp.model.User;
import com.example.quizapp.repository.QuizRepository;
import com.example.quizapp.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizService quizService;

    @Transactional
    public User joinQuiz(String code, String username) {
        Quiz quiz = quizRepository.findByCode(code);
        if (quiz == null) {
            return null; // Quiz not found
        }

    /*    // Check if the user is already in the quiz
        User existingUser = userRepository.findByUsernameAndQuizCode(username, code);
        if (existingUser != null) {
            return existingUser; // Return the existing user
        }    */

        User user = new User();
        user.setUsername(username);
        user.setQuizCode(code); // Store the quiz code with the user
        user.setScore(0);
        user = userRepository.save(user);

        quizService.incrementUserCount(code); // Increment user count.
        return user;
    }

    public void updateScore(String username, String quizCode, boolean isCorrect) {
        User user = userRepository.findByUsernameAndQuizCode(username, quizCode);
        if (user != null && isCorrect) {
            user.setScore(user.getScore() + 1);
            userRepository.save(user);
        }else{
            User user2 = new User(); // Create a new user
        user2.setUsername(username);
        user2.setQuizCode(quizCode); // Store the quiz code with the user
        user2.setScore(1);
        userRepository.save(user2);
        }
        
    }

    public List<Map.Entry<String, Integer>> getLeaderboard(String quizCode) {
        List<User> users = userRepository.findByQuizCodeOrderByScoreDesc(quizCode);
        // Use a LinkedHashMap to maintain order
        Map<String, Integer> scoreMap = new LinkedHashMap<>();
        for (User user : users) {
            scoreMap.put(user.getUsername(), user.getScore());
        }
        return scoreMap.entrySet().stream()
                .collect(Collectors.toList());
    }
}

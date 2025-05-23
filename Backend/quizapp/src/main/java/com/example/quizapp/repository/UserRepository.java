package com.example.quizapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quizapp.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsernameAndQuizCode(String username, String quizCode);
    List<User> findByQuizCodeOrderByScoreDesc(String quizCode);
    User findByEmailAndPassword(String email, String password);
    User findByEmail(String email);
}

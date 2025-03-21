package com.example.quizapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.quizapp.model.Quiz;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    Quiz findByCode(String code);
    boolean existsByCode(String code);
    Quiz save(Quiz quiz);
}

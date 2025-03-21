package com.example.quizapp.repository;

import com.example.quizapp.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Integer> {
    List<Score> findByQuizCodeOrderByScoreDesc(String quizCode);
    Score findByUsernameAndQuizCode(String username, String quizCode);
}

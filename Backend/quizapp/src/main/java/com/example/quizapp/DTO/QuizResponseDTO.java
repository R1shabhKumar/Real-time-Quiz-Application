package com.example.quizapp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuizResponseDTO {
    private int id;
    private String code;
    private String title;
    private String createdByEmail;
    private List<QuestionDTO> questions;

    @Data
    @AllArgsConstructor
    public static class QuestionDTO {
        private int id;
        private String text;
        private List<String> options;
        private int timeLimit;
    }
}

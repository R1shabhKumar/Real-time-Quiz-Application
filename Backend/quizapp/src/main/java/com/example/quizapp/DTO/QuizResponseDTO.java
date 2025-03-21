package com.example.quizapp.DTO;

import java.util.List;

public class QuizResponseDTO {
    private int id;
    private String code;
    private String title;
    private List<QuestionDTO> questions;
    //private int timeLimit; // New field added

    public QuizResponseDTO(int id, String code, String title, List<QuestionDTO> questions) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.questions = questions;
        //this.timeLimit = timeLimit; // Initialize the new field
    }

    public int getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

/*     public int getTimeLimit() { // Getter for timeLimit
        return timeLimit;
    }

    public void setTimeLimit(int timeLimit) { // Setter for timeLimit
        this.timeLimit = timeLimit;
    } */

    public static class QuestionDTO {
        private int id;
        private String text;
        private List<String> options;
        private int timeLimit; 

        public QuestionDTO(int id, String text, List<String> options, int timeLimit) {
            this.id = id;
            this.text = text;
            this.options = options;
            this.timeLimit = timeLimit;
        }

        public int getId() {
            return id;
        }

        public String getText() {
            return text;
        }

        public List<String> getOptions() {
            return options;
        }

        public int getTimeLimit() {
            return timeLimit;
        }

        public void setTimeLimit(int timeLimit) {
            this.timeLimit = timeLimit;
        }
    }
}

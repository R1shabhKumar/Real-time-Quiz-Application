package com.example.quizapp.DTO;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubmitAnswerRequest {
    private String code;
    private String username;
    private int questionId;
    private String answer;
}

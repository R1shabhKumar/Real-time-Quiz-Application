-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    quiz_code VARCHAR(255) NOT NULL
);

-- Create the quiz table
CREATE TABLE quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL
);

-- Create the question table
CREATE TABLE question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    quiz_id INT,
    correct_answer VARCHAR(255) NOT NULL,
    time_limit INT,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id)
);

-- Create the quiz_questions join table (for the @ElementCollection)
CREATE TABLE question_options (
  question_id INT,
  options VARCHAR(255),
  FOREIGN KEY (question_id) REFERENCES question(id)
);

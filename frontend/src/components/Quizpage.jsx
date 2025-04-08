import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa"; // Import clock icon
import { useLocation } from "react-router-dom"; // Import useLocation
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const Quizpage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizId = queryParams.get("quizId");
  const username = queryParams.get("name");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // Track the selected option
  const [isAnswered, setIsAnswered] = useState(false); // Track if the question has been answered
  const [score, setScore] = useState(0); // Track the user's score
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if the quiz is completed
  const [timeLeft, setTimeLeft] = useState(questions[currentQuestion]?.timeLimit || 10); // Timer for each question
  const [questionStatus, setQuestionStatus] = useState([]); // Track the status of each question

  useEffect(() => {
    const fetchQuestionsFromBackend = async () => {
      try {
        const response = await Axios.get(`/api/quiz/get-questions?quizId=${quizId}`);
        if (response.status === 200) {
          const data = response.data;
          console.log("Questions received from backend:", data); // Debugging log
          setQuestions(data); // Set questions dynamically from the backend
        } else {
          console.error("Failed to fetch questions from backend");
        }
      } catch (error) {
        console.error("Error fetching questions from backend:", error);
      }
    };

    fetchQuestionsFromBackend();
  }, [quizId]);

  useEffect(() => {
    setTimeLeft(questions[currentQuestion]?.timeLimit || 10); // Update timer when question changes
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const sendUpdateToBackend = async () => {
    try {
      const response = await Axios.post("/api/user/update-score", {
        username, // Include username in the score update
        questionIndex: currentQuestion,
        score: score + 1, // Increment score for the correct answer
      });

      if (response.status !== 200) {
        console.error("Failed to update the backend");
      }
    } catch (error) {
      console.error("Error updating the backend:", error);
    }
  };

  const handleTimeout = () => {
    setIsAnswered(true);

    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = "skipped";
    setQuestionStatus(updatedStatus);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const handleOptionSelect = (optionIndex) => {
    if (isAnswered) return; // Prevent multiple selections for the same question

    const selectedOptionText = questions[currentQuestion]?.options[optionIndex]; // Get the selected option text
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const updatedStatus = [...questionStatus];
    // Update the score and question status if the selected option matches the correctAnswer
    if (selectedOptionText === questions[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
      updatedStatus[currentQuestion] = "correct";
      sendUpdateToBackend(); // Send update to the backend
    } else {
      updatedStatus[currentQuestion] = "incorrect";
    }
    setQuestionStatus(updatedStatus);

    // Add a 1-second delay before moving to the next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setQuizCompleted(true); // Mark the quiz as completed
      }
    }, 1000);
  };

  const handleSkip = () => {
    if (isAnswered) return; // Prevent skipping if already answered

    setIsAnswered(true);

    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = "skipped";
    setQuestionStatus(updatedStatus);

    // Add a 1-second delay before moving to the next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(questions[currentQuestion + 1]?.timeLimit || 10); // Reset timer for the next question
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-200 to-white">
      <div className="p-8 w-full max-w-2xl rounded-lg bg-white dark:bg-gray-900 shadow-lg transform transition duration-500 hover:scale-105">
        {!quizCompleted ? (
          <>
            <div className="flex justify-center mb-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full mx-1 ${
                    index === currentQuestion
                      ? "bg-yellow-500"
                      : index < currentQuestion && questionStatus[index] === "correct"
                      ? "bg-green-500"
                      : index < currentQuestion
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
              Quiz Time!
            </h1>
            <div className="mb-4">
              <span className="text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="ml-4 text-gray-600 dark:text-gray-300 flex items-center">
                <FaClock className="mr-2" /> Time Left: {timeLeft}s
              </span>
            </div>
            <div className="mb-6">
              {questions.length > 0 && questions[currentQuestion]?.text ? (
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {questions[currentQuestion]?.text}
                </h2>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Loading question...</p>
              )}
            </div>
            <div className="space-y-4">
              {questions.length > 0 &&
                questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full px-4 py-2 text-left border rounded-lg transition duration-300 focus:outline-none ${
                      isAnswered
                        ? questions[currentQuestion]?.correctAnswer === option
                          ? "bg-green-100 border-green-500 text-green-800 font-bold"
                          : selectedOption === index
                          ? "bg-red-100 border-red-500 text-red-800 font-bold"
                          : "hover:bg-blue-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-600"
                        : "hover:bg-blue-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-600"
                    }`}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswered}
                  >
                    {option}
                  </button>
                ))}
            </div>
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 border rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={handleSkip}
                disabled={isAnswered}
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Quiz Completed!
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Your Score: <span className="font-bold">{score}</span> / {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizpage;
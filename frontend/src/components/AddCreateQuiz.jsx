import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const AddCreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    timeLimit: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const addNextQuestion = () => {
    if (
      !currentQuestion.question ||
      currentQuestion.options.some((opt) => !opt) ||
      !currentQuestion.correctAnswer ||
      !currentQuestion.timeLimit
    ) {
      toast.error("Please fill out all fields before adding the question.");
      return;
    }

    // Convert timeLimit to a number
    const formattedQuestion = {
      ...currentQuestion,
      timeLimit: parseInt(currentQuestion.timeLimit, 10), // Ensure timeLimit is an integer
    };

    setQuestions((prev) => [...prev, formattedQuestion]);
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      timeLimit: "",
    });
    toast.success("Question added successfully!");
  };

  const submitQuiz = async () => {
    if (!quizTitle) {
      toast.error("Please enter a quiz title before submitting.");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question before submitting.");
      return;
    }

    const createdByEmail = localStorage.getItem("email"); // Retrieve email from local storage

    try {
      const response = await Axios.post("/api/quiz", { 
        title: quizTitle, 
        createdByEmail,
        questions 
         // Pass the email as a parameter
      });

      if (response.status === 200) {
        toast.success("Quiz submitted successfully!");
        setQuizTitle("");
        setQuestions([]);
      } else {
        toast.error("Failed to submit quiz.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("An error occurred while submitting the quiz.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 dark:bg-gray-900 overflow-y-auto">
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-10 dark:bg-gray-800 flex justify-center items-center px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a Quiz</h1>
        <button
          onClick={submitQuiz}
          className="absolute right-6 px-5 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-700"
        >
          Create
        </button>
      </header>
      <div className="mt-20 w-full max-w-4xl px-6">
        <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 dark:text-gray-300">Quiz Title:</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter quiz title"
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 dark:bg-gray-800">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 dark:text-gray-300">Question:</label>
            <input
              type="text"
              name="question"
              value={currentQuestion.question}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your question"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 dark:text-gray-300">Time Limit (seconds):</label>
            <input
              type="number"
              name="timeLimit"
              value={currentQuestion.timeLimit || ''}
              onChange={(e) => handleInputChange(e)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter time limit in seconds"
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 dark:bg-gray-800">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 dark:text-gray-300">Options:</label>
            {currentQuestion.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1 dark:text-gray-300">Correct Answer:</label>
            <input
              type="text"
              name="correctAnswer"
              value={currentQuestion.correctAnswer}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter the correct answer"
            />
          </div>
          <div className="flex justify-between gap-3">
            <button
              onClick={addNextQuestion}
              className="px-5 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-green-700"
            >
              Add Next Question
            </button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Added Questions</h2>
          <ul className="space-y-4">
            {questions.map((question, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-md dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 dark:text-gray-300 font-medium">{index + 1}. {question.question}</p>
                  <button
                    onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
                    className="px-3 py-1 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  {question.options.map((option, idx) => (
                    <li key={idx} className="text-gray-600 dark:text-gray-400">- {option}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Correct Answer: {question.correctAnswer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time Limit: {question.timeLimit} seconds</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCreateQuiz;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const EditQuiz = () => {
  const navigate = useNavigate(); // For navigation in case of errors
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Retrieve the quiz code from localStorage
        const storedCode = localStorage.getItem("quizCode");

        if (!storedCode) {
          throw new Error("Quiz code is missing!"); // Throw an error if the code is not found
        }

        // Send GET request with code as a query parameter
        const response = await Axios.get(`/api/quiz/get?code=${storedCode}`);
        const { title, questions } = response.data;

        setQuizTitle(title);
        setQuestions(
          questions.map((q) => ({
            ...q,
            correctAnswer: q.correctAnswer || "", // Ensure correctAnswer has a default value
          }))
        );
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error(error.message || "Failed to fetch quiz data.");
        navigate("/dashboard"); // Redirect to the dashboard if an error occurs
      }
    };

    fetchQuizData();
  }, [navigate]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '', timeLimit: 30 }]);
  };

  const handleSaveQuiz = async () => {
    // Validation checks
    if (!quizTitle.trim()) {
      toast.error('Quiz title is required!');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.text.trim()) {
        toast.error(`Question ${i + 1} is required!`);
        return;
      }
      if (question.options.some(option => !option.trim())) {
        toast.error(`All options for Question ${i + 1} are required!`);
        return;
      }
      if (!question.correctAnswer.trim()) {
        toast.error(`Correct answer for Question ${i + 1} is required!`);
        return;
      }
      if (!question.options.includes(question.correctAnswer)) {
        toast.error(`Correct answer for Question ${i + 1} must be one of the options!`);
        return;
      }
      if (!question.timeLimit || question.timeLimit <= 0) {
        toast.error(`Valid time limit for Question ${i + 1} is required!`);
        return;
      }
    }

    try {
      const storedCode = localStorage.getItem("quizCode"); // Retrieve the quiz code from localStorage
      if (!storedCode) {
        throw new Error("Quiz code is missing!");
      }

      await Axios.put(`/api/quiz/${storedCode}`, {
        title: quizTitle,
        questions,
      }); // Use Axios
      toast.success('Quiz updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Error saving quiz!');
      console.error('Error saving quiz:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-blue-200 to-white">
      <div className="p-8 w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 shadow-md">
          <div className="relative">
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              Edit Quiz
            </h1>
            <button
              onClick={handleSaveQuiz}
              className="absolute top-0 right-0 bg-green-500 text-white py-1 px-3 rounded-lg font-semibold shadow-md hover:bg-green-600 transition duration-300"
            >
              Save
            </button>
          </div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Editing quiz with Code: {localStorage.getItem("quizCode") || "N/A"}
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Quiz Title</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                  Question {index + 1}
                </label>
                <button
                  onClick={() => {
                    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
                    setQuestions(updatedQuestions);
                  }}
                  className="bg-red-500 text-white py-1 px-3 rounded-lg font-semibold shadow-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
              <input
                type="text"
                value={question.text}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].question = e.target.value;
                  setQuestions(updatedQuestions);
                }}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
              <h3 className="text-md font-bold text-gray-700 dark:text-gray-300 mt-4">Options</h3>
              <div className="mt-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[index].options[optIndex] = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
              <label className="block text-gray-700 dark:text-gray-300 font-bold mt-4">
                Correct Answer
              </label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].correctAnswer = e.target.value;
                  setQuestions(updatedQuestions);
                }}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
              <label className="block text-gray-700 dark:text-gray-300 font-bold mt-4">
                Time Limit (seconds)
              </label>
              <input
                type="number"
                value={question.timeLimit || 30}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index].timeLimit = parseInt(e.target.value, 10);
                  setQuestions(updatedQuestions);
                }}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          ))}
          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import toast from "react-hot-toast";
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const JoinQuiz = () => {
  const [name, setName] = useState("");
  const [quizId, setQuizId] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizIdRegex = /^[A-Z0-9]{6}$/; // Regex for 6 characters, uppercase letters, and numbers only

    if (!name || !quizId) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (!quizIdRegex.test(quizId)) {
      toast.error("Quiz ID must be exactly 6 characters long and include only uppercase letters and numbers.");
      return;
    }

    try {
      const response = await Axios.get(`/api/quiz/validate-quiz?quizId=${quizId}`); // Use Axios
      if (response.status === 200) {
        const isValid = response.data;
        if (isValid) {
          // Send POST request to join the quiz
          try {
            const joinResponse = await Axios.post("/api/user/join", {
              code: quizId,
              username: name,
            });

            if (joinResponse.status === 200 && joinResponse.data.success) {
              toast.success("Successfully joined the quiz!");
              navigate(`/quiz?quizId=${quizId}&name=${name}`); // Navigate to QuizPage with query params
            } else {
              toast.error(joinResponse.data.message || "Failed to join the quiz.");
            }
          } catch (joinError) {
            console.error("Error joining the quiz:", joinError);
            toast.error("An error occurred while joining the quiz. Please try again.");
          }
        } else {
          toast.error("Invalid Quiz ID.");
          navigate("/"); // Redirect to JoinQuiz page
        }
      } else {
        toast.error("Failed to validate Quiz ID.");
      }
    } catch (error) {
      console.error("Error validating Quiz ID:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400">
      <div className="border p-8 w-full max-w-md rounded-lg bg-white dark:bg-gray-900 shadow-lg transform transition duration-500 hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Join Quiz
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:text-white hover:border-blue-500 hover:shadow-md transition duration-300"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="quizId" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Quiz ID
            </label>
            <input
              type="text"
              id="quizId"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-800 dark:text-white hover:border-blue-500 hover:shadow-md transition duration-300"
              placeholder="Enter quiz ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transform transition duration-300"
          >
            Join Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinQuiz;
import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzes, setQuizzes] = useState([]); // Fetch quizzes from backend
  const [email, setEmail] = useState(""); // State to store email
  const [name, setName] = useState(""); // State to store name
  const quizzesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await Axios.post("/api/admin/quizzes", {
          email, // Send the user's email as a parameter
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    // Retrieve email from local storage
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      const extractedName = storedEmail.split("@")[0]; // Extract name from email
      setName(extractedName);
    }

    if (email) {
      fetchQuizzes(); // Fetch quizzes only after email is set
    }
  }, [email]); // Add email as a dependency

  const handleCreateQuiz = () => {
    navigate('/add');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add logout logic here
  };

  const handleQuizClick = (code) => {
    localStorage.setItem("quizCode", code); // Save the quiz code in local storage
    navigate(`/edit`); // Navigate to the edit page
  };

  const handleLeaderboardClick = (code) => {
    localStorage.setItem("quizCode", code); // Save the quiz code in local storage
    navigate(`/leaderboard`); // Navigate to the leaderboard page
  };

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 via-blue-200 to-white">
      {/* Profile Icon */}
      <button
        onClick={handleProfileClick}
        className="absolute top-5 right-5 text-blue-500 hover:text-blue-700 transition duration-300"
      >
        <FaUserCircle size={40} />
      </button>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="absolute top-16 right-5 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg w-64">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            Educator Profile
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Name: {name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Email: {email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      )}

      <div className="p-8 w-full max-w-4xl bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Educator Dashboard
        </h1>
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateQuiz}
            className="flex items-center justify-center w-1/4 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-green-600 transition duration-300"
          >
            <FaPlus className="mr-2" /> Create Quiz
          </button>
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Your Quizzes
        </h3>
        {/* Quiz Headings */}
        <div className="grid grid-cols-2 text-gray-800 dark:text-white font-semibold mb-2">
          <span>Quiz ID</span>
          <span>Quiz Name</span>
        </div>
        {/* Scrollable Quiz List */}
        <div className="max-h-64 overflow-y-auto">
          <ul className="space-y-4">
            {currentQuizzes.map((quiz) => (
              <li
                key={quiz.code} // Use code as the unique key
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {quiz.code} {/* Display the unique 6-character code */}
                  </span>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {quiz.title}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuizClick(quiz.code)} // Pass code to handleQuizClick
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleLeaderboardClick(quiz.code)} // Pass code to handleLeaderboardClick
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition duration-300"
                  >
                    Leaderboard
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-semibold shadow-md ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
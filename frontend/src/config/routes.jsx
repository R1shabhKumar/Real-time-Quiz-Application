import React from "react";
import { Routes, Route } from "react-router"; // Remove Navigate import
import App from "../App";
import HomePage from "../components/HomePage";
import Leaderboard from "../components/Leaderboard";
import Quizpage from "../components/Quizpage";
import Dashboard from "../components/Dashboard";
import AddCreateQuiz from "../components/AddCreateQuiz";
import EditQuiz from "../components/EditQuiz";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<h1>this is the home page</h1>} />
      <Route path="/authentication" element={<h1>this is the authentication page</h1>} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/quiz" element={<Quizpage />} />
      <Route path="/result" element={<h1>this is the result page</h1>} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add" element={<AddCreateQuiz />} />
      <Route path="/edit" element={<EditQuiz />} />
    </Routes>
  );
};

export default AppRoutes;
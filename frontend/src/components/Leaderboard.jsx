import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs"; // Import STOMP client for WebSocket
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const Leaderboard = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await Axios.get(`/api/leaderboard/${quizId}`); // Use Axios
        setPlayers(response.data.players);
        setActiveUsers(response.data.activeUsers);
        setTimeLeft(response.data.timeLeft);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Failed to fetch leaderboard data.");
      }
    };

    fetchLeaderboardData();

    // WebSocket setup
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws", // Replace with your WebSocket server URL
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to user scores updates
        client.subscribe(`/topic/scores/${quizId}`, (message) => {
          const data = JSON.parse(message.body);
          setPlayers(data.players); // Update players with new scores
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
      debug: (str) => console.log(str),
    });

    client.activate();

    return () => {
      client.deactivate(); // Cleanup WebSocket connection on component unmount
    };
  }, [quizId]);

  const saveAsExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        players.map((player, index) => ({
          Position: index + 1,
          User: player.name,
          Score: player.score,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");
      XLSX.writeFile(workbook, "leaderboard.xlsx");
      toast.success("Excel file saved successfully!");
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error("Failed to save Excel file.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 pt-10">
      <Toaster />
      <h1 className="text-4xl font-bold text-white mb-4">Leaderboard</h1>
      <p className="text-white mb-2">Active Users: {activeUsers}</p>
      <p className="text-white mb-6">
        Time Left:{" "}
        {timeLeft !== null
          ? `${Math.floor(timeLeft / 60000)}m ${Math.floor((timeLeft % 60000) / 1000)}s`
          : "Loading..."}
      </p>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back
        </button>
        <button
          onClick={saveAsExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save as Excel
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 w-3/4 max-w-md">
        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-left text-gray-800">
            <thead>
              <tr>
                <th className="border-b-2 pb-2 text-gray-600">Position</th>
                <th className="border-b-2 pb-2 text-gray-600">User</th>
                <th className="border-b-2 pb-2 text-gray-600">Score</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.tr
                    key={player.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`hover:bg-gray-100 ${
                      index === 0
                        ? "bg-yellow-300"
                        : index === 1
                        ? "bg-gray-300"
                        : index === 2
                        ? "bg-orange-300"
                        : ""
                    }`}
                  >
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">{player.name}</td>
                    <td className="py-2">{player.score}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
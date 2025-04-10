import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs"; // Import STOMP client for WebSocket
import { Axios } from "../config/AxiosHelper"; // Import Axios from AxiosHelper.js

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]); // Leaderboard players
  const [activeUsers, setActiveUsers] = useState(0); // Active users count
  const [timeLeft, setTimeLeft] = useState(0); // Time left (placeholder)

  useEffect(() => {
    const storedCode = localStorage.getItem("quizCode"); // Retrieve the quiz code from local storage

    if (!storedCode) {
      toast.error("Quiz code is missing!");
      navigate("/dashboard"); // Redirect to dashboard or another page
      return;
    }

    const fetchLeaderboardData = async () => {
      try {
        // Fetch leaderboard data from backend
        const response = await Axios.get(`/api/admin/leaderboard/${storedCode}`);
        console.log("Players data (raw):", response.data.players); // Debugging log

        // Transform the players data into the expected format
        const transformedPlayers = response.data.players.map((player) => {
          const [name, score] = Object.entries(player)[0]; // Extract key-value pair
          return { name, score }; // Return transformed object
        });

        setPlayers(transformedPlayers); // Set transformed players data
        console.log("Players data (transformed):", transformedPlayers); // Debugging log
        setActiveUsers(response.data.activeUsers); // Set active users count
        setTimeLeft(response.data.timeLeft); // Set time left (placeholder)
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Failed to fetch leaderboard data.");
      }
    };

    fetchLeaderboardData();

    // WebSocket setup using native WebSocket URL
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws", // Use WebSocket URL directly
      connectHeaders: {
        // Add any required headers here if needed
      },
      debug: (str) => console.log(str), // Debug logs for WebSocket
      reconnectDelay: 5000, // Reconnect after 5 seconds if disconnected
      heartbeatIncoming: 4000, // Heartbeat interval for incoming messages
      heartbeatOutgoing: 4000, // Heartbeat interval for outgoing messages
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");

      // Subscribe to the topic for scores
      client.subscribe(`/topic/scores/${storedCode}`, (message) => {
        try {
          const rawData = JSON.parse(message.body);
          console.log("WebSocket message received (raw):", rawData); // Debugging log

          // Extract the players array from the rawData
          const playersData = rawData.players;

          // Check if playersData is an array
          if (Array.isArray(playersData)) {
            // Transform the data into the expected format
            const transformedData = playersData.map((player) => {
              const [name, score] = Object.entries(player)[0]; // Extract key-value pair
              return { name, score }; // Return transformed object
            });

            console.log("Transformed WebSocket data:", transformedData); // Debugging log
            setPlayers(transformedData); // Update players with transformed data
          } else {
            console.error("WebSocket data 'players' is not an array:", playersData);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    client.activate();

    return () => {
      client.deactivate(); // Cleanup WebSocket connection on component unmount
    };
  }, [navigate]);

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
                    key={player.name || index} // Use player.name if unique, otherwise fallback to index
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
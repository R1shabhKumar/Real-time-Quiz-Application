import React, { useState, useEffect } from "react";

const delay = 300;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const NQueensVisualizer = () => {
  const [n, setN] = useState(8); // Default value for n
  const [board, setBoard] = useState([]);
  const [renderKey, setRenderKey] = useState(0); 
  const [finished, setFinished] = useState(false); // State to track if the process is finished

  useEffect(() => {
    if (n >= 4) {
      createBoard(n);
    }
  }, [n, renderKey]);

  const createBoard = (size) => {
    if (isNaN(size) || size < 4) return; // Prevent invalid board creation
    const newBoard = Array(size).fill(-1);
    setBoard(newBoard);
    setFinished(false); // Reset the finished state when the board is recreated
  };

  const drawQueen = (row, col, show) => {
    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) {
      cell.innerHTML = show ? "♛" : "";
      if (show) {
        cell.classList.add("queen");
        cell.style.color = "gold";
      } else {
        cell.classList.remove("queen");
        cell.style.color = ""; 
      }
    }
  };

  const isSafe = (board, row, col) => {
    for (let i = 0; i < row; i++) {
      if (
        board[i] === col ||
        board[i] - i === col - row ||
        board[i] + i === col + row
      ) {
        return false;
      }
    }
    return true;
  };

  const solve = async (board, row, n) => {
    if (row === n) return true;

    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col)) {
        board[row] = col;
        drawQueen(row, col, true);
        await sleep(delay);

        if (await solve(board, row + 1, n)) return true;

        // Backtrack
        drawQueen(row, col, false);
        board[row] = -1;
        await sleep(delay);
      }
    }
    return false;
  };

  const startVisualizer = async () => {
    if (n < 4) {
      alert("N must be at least 4");
      return;
    }

    setRenderKey((prev) => prev + 1); // forces board refresh
    const boardArr = Array(n).fill(-1);
    await sleep(100); // delay to let board render
    const solved = await solve(boardArr, 0, n);
    if (solved) {
      setFinished(true); // Set finished state to true when the process is complete
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          N-Queens Visualizer 🧠♛
        </h1>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <label className="text-white font-semibold text-lg">Enter N:</label>
          <input
            type="number"
            min="4"
            value={n}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setN(isNaN(value) ? 4 : value); // Reset to 4 if input is empty or invalid
            }}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={startVisualizer}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
          >
            Start Animation
          </button>
        </div>
        <div
          id="board"
          className="grid mx-auto border-2 border-gray-700"
          style={{
            gridTemplateColumns: `repeat(${n}, 40px)`,
            width: `${n * 40}px`,
          }}
        >
          {Array.from({ length: n * n }).map((_, i) => {
            const row = Math.floor(i / n);
            const col = i % n;
            const isWhite = (row + col) % 2 === 0;
            return (
              <div
                key={`cell-${row}-${col}`}
                id={`cell-${row}-${col}`}
                className={`cell ${
                  isWhite ? "bg-gray-300" : "bg-gray-700"
                } flex items-center justify-center text-2xl transition-all duration-300`}
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
            );
          })}
        </div>
        {finished && (
          <div className="text-center text-green-400 font-bold text-xl mt-4">
            Finished!
          </div>
        )}
      </div>
    </div>
  );
};

export default NQueensVisualizer;
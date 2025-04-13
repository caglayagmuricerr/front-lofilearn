import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

function JoinQuiz() {
  const [gameCode, setGameCode] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // join game logic here
    console.log("Joining game:", { gameCode, username });
    navigate(`/play/${gameCode}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join a Quiz
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the game code and your name to join
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="gameCode"
                className="block text-sm font-medium text-gray-700"
              >
                Game Code
              </label>
              <input
                id="gameCode"
                name="gameCode"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                placeholder="Enter 6-digit code"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinQuiz;

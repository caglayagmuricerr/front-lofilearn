import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { io, Socket } from "socket.io-client";
// Example: import { AuthContext } from "../context/AuthContext";

function JoinQuiz() {
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  // Example: get user from context
  // const { user } = useContext(AuthContext);

  useEffect(() => {
    // Get token from localStorage or cookies
    const cookie = document.cookie;
    const token = cookie.split("%20")[1].trim();

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    // Create socket connection with authentication
    const newSocket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
      {
        auth: {
          token: token,
        },
      }
    );

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error.message);
      setError("Authentication failed. Please log in again.");
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode) {
      setError("Please enter the game code.");
      return;
    }

    if (!socket) {
      setError("Connection not established. Please try again.");
      return;
    }

    // Emit join-lobby event (name will be extracted from token on server)
    socket.emit("join-lobby", { inviteCode: gameCode });
    navigate(`/play/${gameCode}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 pb-24">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-chestnut-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join a Quiz
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter the game code to join
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-chestnut-500 focus:border-chestnut-500"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                placeholder="Enter 6-digit code"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-500"
            disabled={!socket}
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinQuiz;

import { useState, useEffect } from "react";
import useSound from "use-sound";
import { useGameStore } from "../store/gameStore";
import { SOUND_PATHS } from "../utils/Sounds";

function PlayQuiz() {
  const gameStore = useGameStore();
  const [timeLeft, setTimeLeft] = useState(20);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Sound effects
  const [playCorrect] = useSound(SOUND_PATHS.correct);
  const [playIncorrect] = useSound(SOUND_PATHS.incorrect);
  const [playCountdown] = useSound(SOUND_PATHS.countdown);

  useEffect(() => {
    if (timeLeft > 0 && !showLeaderboard) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4) playCountdown();
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showLeaderboard) {
      setShowLeaderboard(true);
    }
  }, [timeLeft, showLeaderboard, playCountdown]);

  const handleAnswer = (answer: number) => {
    if (answer === 2) {
      // Assuming 2 is correct answer for demo
      playCorrect();
    } else {
      playIncorrect();
    }
    setShowLeaderboard(true);
  };

  const sortedPlayers = [...gameStore.players].sort(
    (a, b) => b.score - a.score
  );

  if (showLeaderboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Leaderboard</h2>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="font-bold text-lg mr-4">{index + 1}</span>
                  <span>{player.username}</span>
                </div>
                <span className="font-bold text-purple-600">
                  {player.score}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setShowLeaderboard(false);
              setTimeLeft(20);
            }}
            className="mt-6 w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Next Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Question {gameStore.currentQuestion + 1}
            </h2>
            <div className="text-3xl font-bold text-purple-600">{timeLeft}</div>
          </div>

          <div className="aspect-video bg-gray-100 rounded-lg mb-8">
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
              alt="Question"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <p className="text-xl mb-8">What is the capital of France?</p>

          <div className="grid grid-cols-2 gap-4">
            {["London", "Berlin", "Paris", "Madrid"].map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="p-4 text-lg font-medium rounded-lg transition-colors duration-200 hover:bg-purple-600 hover:text-white"
                style={{
                  backgroundColor: [
                    "bg-red-100",
                    "bg-blue-100",
                    "bg-yellow-100",
                    "bg-green-100",
                  ][index],
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayQuiz;

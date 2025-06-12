import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Player {
  name: string;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

interface QuizState {
  players: string[];
  currentQuestion?: Question;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  scores: Record<string, number>;
  isQuizStarted: boolean;
  isQuizEnded: boolean;
  selectedAnswer?: number;
  hasAnswered: boolean;
}

const PlayQuiz = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    players: [],
    questionIndex: 0,
    totalQuestions: 0,
    timeLeft: 0,
    scores: {},
    isQuizStarted: false,
    isQuizEnded: false,
    hasAnswered: false,
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cookie = document.cookie;
    const token = cookie.split("%20")[1].trim();

    if (!token) {
      navigate("/login");
      return;
    }

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("connect", () => {
      setConnectionStatus("connected");
      if (inviteCode) {
        newSocket.emit("join-lobby", { inviteCode });
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionStatus("error");
      if (error.message.includes("Authentication")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });

    newSocket.on("lobby-update", ({ players, message }) => {
      setQuizState((prev) => ({ ...prev, players }));
      setMessage(message);
      setTimeout(() => setMessage(""), 3000);
    });

    newSocket.on("quiz-started", ({ totalQuestions }) => {
      setQuizState((prev) => ({
        ...prev,
        isQuizStarted: true,
        totalQuestions,
        questionIndex: 0,
      }));
    });

    newSocket.on("new-question", ({ question, questionIndex, timeLimit }) => {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: question,
        questionIndex,
        timeLeft: timeLimit,
        selectedAnswer: undefined,
        hasAnswered: false,
      }));
    });

    newSocket.on("time-update", ({ timeLeft }) => {
      setQuizState((prev) => ({ ...prev, timeLeft }));
    });

    newSocket.on("question-ended", ({ correctAnswer, scores }) => {
      setQuizState((prev) => ({
        ...prev,
        scores,
        currentQuestion: prev.currentQuestion
          ? {
              ...prev.currentQuestion,
              correctAnswer,
            }
          : undefined,
      }));
    });

    newSocket.on("quiz-ended", ({ finalScores, winner }) => {
      setQuizState((prev) => ({
        ...prev,
        isQuizEnded: true,
        scores: finalScores,
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [inviteCode, navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.hasAnswered || !socket) return;

    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
      hasAnswered: true,
    }));

    socket.emit("submit-answer", {
      questionId: quizState.currentQuestion?.id,
      answer: answerIndex,
      timeRemaining: quizState.timeLeft,
    });
  };

  const startQuiz = () => {
    if (socket) {
      socket.emit("start-quiz", { inviteCode });
    }
  };

  const leaveQuiz = () => {
    if (socket) {
      socket.close();
    }
    navigate("/student-dashboard");
  };

  if (connectionStatus === "connecting") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to quiz...</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Connection Error</div>
          <p className="text-gray-600 mb-4">
            Unable to connect to the quiz server.
          </p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quiz Room</h1>
              <p className="text-gray-600">Invite Code: {inviteCode}</p>
            </div>
            <button
              onClick={leaveQuiz}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Leave Quiz
            </button>
          </div>
          {message && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-800">
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Players Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Players ({quizState.players.length})
            </h2>
            <div className="space-y-2">
              {quizState.players.map((player, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <span className="font-medium">{player}</span>
                  {quizState.isQuizStarted && (
                    <span className="text-sm text-gray-600">
                      Score: {quizState.scores[player] || 0}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!quizState.isQuizStarted && quizState.players.length > 0 && (
              <button
                onClick={startQuiz}
                className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Start Quiz
              </button>
            )}
          </div>

          {/* Quiz Content */}
          <div className="lg:col-span-2">
            {!quizState.isQuizStarted ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Waiting for Quiz to Start
                </h2>
                <p className="text-gray-600">
                  Share the invite code <strong>{inviteCode}</strong> with other
                  players to join!
                </p>
              </div>
            ) : quizState.isQuizEnded ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Quiz Complete! 🎉
                </h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">
                    Final Scores:
                  </h3>
                  {Object.entries(quizState.scores)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([player, score], index) => (
                      <div
                        key={player}
                        className={`flex justify-between items-center p-4 rounded ${
                          index === 0
                            ? "bg-yellow-100 border-2 border-yellow-300"
                            : "bg-gray-50"
                        }`}
                      >
                        <span className="font-medium">
                          {index === 0 && "👑 "}
                          {player}
                        </span>
                        <span className="text-lg font-bold">{score}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Question Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Question {quizState.questionIndex + 1} of{" "}
                      {quizState.totalQuestions}
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {quizState.timeLeft}s
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((quizState.questionIndex + 1) /
                            quizState.totalQuestions) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Question */}
                {quizState.currentQuestion && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                      {quizState.currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizState.currentQuestion.options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={quizState.hasAnswered}
                            className={`p-4 text-left rounded-lg border-2 transition-all ${
                              quizState.selectedAnswer === index
                                ? "border-blue-500 bg-blue-50"
                                : quizState.hasAnswered
                                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <span className="font-medium text-gray-700">
                              {String.fromCharCode(65 + index)}. {option}
                            </span>
                          </button>
                        )
                      )}
                    </div>

                    {quizState.hasAnswered && (
                      <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-green-800">
                        Answer submitted! Waiting for other players...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayQuiz;

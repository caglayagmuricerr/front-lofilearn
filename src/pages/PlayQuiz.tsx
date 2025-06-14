import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

interface Player {
  name: string;
  role: string;
  score?: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  image?: string;
}

interface QuizState {
  players: Player[];
  currentQuestion?: Question;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  scores: Record<string, number>;
  isQuizStarted: boolean;
  isQuizEnded: boolean;
  selectedAnswer?: number;
  hasAnswered: boolean;
  userRole?: string;
}

const PlayQuiz = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [userRole, setUserRole] = useState<string>("");
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

    const decodedToken = jwtDecode<{ role: string }>(token);
    setUserRole(decodedToken.role);

    if (!token) {
      navigate("/login");
      return;
    }
    //console.log("Invite code from params:", inviteCode);
    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    newSocket.on("connect", () => {
      //console.log("Socket connected successfully");
      setConnectionStatus("connected");
      if (inviteCode) {
        //console.log("Emitting join-lobby with code:", inviteCode);
        newSocket.emit("join-lobby", { inviteCode });
      } else {
        console.error("No invite code available");
      }
    });

    newSocket.on("lobby-update", ({ players, message }) => {
      //console.log("Received lobby-update:", { players, message });
      setQuizState((prev) => ({
        ...prev,
        players: players || [],
      }));
      if (message) {
        setMessage(message);
        setTimeout(() => setMessage(""), 3000);
      }
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

    newSocket.on("quiz-ended", ({ finalScores }) => {
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
    if (quizState.hasAnswered || !socket || userRole !== "student") return;

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
    if (socket && userRole === "teacher") {
      socket.emit("start-quiz", { inviteCode });
    }
  };

  const leaveQuiz = () => {
    if (socket) {
      socket.close();
    }
    if (userRole === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/student-dashboard");
    }
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
                  <span className="font-medium">
                    {player.name} ({player.role})
                  </span>
                  {quizState.isQuizStarted && player.role === "student" && (
                    <span className="text-sm text-gray-600">
                      Score: {quizState.scores[player.name] || 0}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {!quizState.isQuizStarted &&
              quizState.players.length > 0 &&
              userRole === "teacher" && (
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
                {userRole === "teacher" && (
                  <p className="text-blue-600 mt-2">
                    As a teacher, you can start the quiz when ready.
                  </p>
                )}
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
                    .map(([playerName, score], index) => {
                      const player = quizState.players.find(
                        (p) => p.name === playerName
                      );
                      return (
                        <div
                          key={playerName}
                          className={`flex justify-between items-center p-4 rounded ${
                            index === 0
                              ? "bg-yellow-100 border-2 border-yellow-300"
                              : "bg-gray-50"
                          }`}
                        >
                          <span className="font-medium">
                            {index === 0 && "👑 "}
                            {playerName} ({player?.role || "Unknown"})
                          </span>
                          <span className="text-lg font-bold">{score}</span>
                        </div>
                      );
                    })}
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

                    {/* Question Image */}
                    {quizState.currentQuestion?.image && (
                      <div className="mb-6 flex justify-center">
                        <div className="max-w-md w-full">
                          <img
                            src={`http://localhost:5000${quizState.currentQuestion.image}`}
                            alt="Question"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                              console.error(
                                "Error loading image:",
                                quizState.currentQuestion?.image
                              );
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {userRole === "teacher" ? (
                      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-blue-800 font-medium">
                          You are observing as a teacher. Students are answering
                          the question.
                        </p>
                      </div>
                    ) : (
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
                    )}

                    {quizState.hasAnswered && userRole === "student" && (
                      <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-white">
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

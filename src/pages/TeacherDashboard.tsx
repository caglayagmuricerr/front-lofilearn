import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Participant {
  user: string;
  status: "invited" | "completed";
  startTime?: string;
}

interface Quiz {
  _id: number;
  title: string;
  participants?: Participant[];
  createdAt?: string;
  totalQuestions?: number;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  quizzesCreated: Quiz[];
  lastLogin: string;
  isVerified: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

function TeacherDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    navigate("/create");
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setUserInfo(result.data);
        console.log("User Info:", result.data);
        setError("");
      } else {
        setError(result.message || "Failed to fetch user information");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchQuizzes = async (userId: string) => {
    try {
      const response = await fetch(`/api/quizzes?createdBy=${userId}`, {
        credentials: "include",
      });
      const result = await response.json();
      if (result.success && result.data) {
        setQuizzes(result.data);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError("Failed to fetch quizzes");
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (userInfo?._id) {
      fetchQuizzes(userInfo._id);
    }
  }, [userInfo]);

  const getQuizStats = (quiz: Quiz) => {
    const participants = quiz.participants || [];
    const completed = participants.filter(
      (p) => p.status === "completed"
    ).length;
    const invited = participants.filter((p) => p.status === "invited").length;

    return { completed, invited, total: participants.length };
  };

  const activeQuizzes = quizzes;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
        <button
          onClick={fetchUserInfo}
          className="mt-4 bg-chestnut-500 text-white px-4 py-2 rounded hover:bg-chestnut-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-400">
          No user information available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        {userInfo.profilePicture && (
          <img
            src={userInfo.profilePicture}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <div>
          <h1 className="text-white text-3xl font-bold">
            Welcome, {userInfo.name}!
          </h1>
          <p className="text-gray-400">{userInfo.email}</p>
          {!userInfo.isVerified && (
            <p className="text-orange-600 text-sm">⚠️ Account not verified</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-6">
        Last login: {new Date(userInfo.lastLogin).toLocaleDateString()}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-semibold">Your Quizzes</h2>
        <button
          onClick={handleCreateQuiz}
          className="bg-chestnut-500 text-white px-4 py-2 rounded hover:bg-chestnut-600"
        >
          Create New Quiz
        </button>
      </div>

      {activeQuizzes.length > 0 ? (
        <div className="grid gap-4">
          {activeQuizzes.map((quiz) => {
            const stats = getQuizStats(quiz);
            return (
              <div
                key={quiz._id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white text-lg font-semibold">
                    {quiz.title}
                  </h3>
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Edit
                    </button>
                    <button className="text-green-400 hover:text-green-300 text-sm">
                      Share
                    </button>
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {stats.completed}
                    </div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {stats.invited}
                    </div>
                    <div className="text-sm text-gray-400">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {stats.total}
                    </div>
                    <div className="text-sm text-gray-400">Total Invited</div>
                  </div>
                </div>

                {quiz.createdAt && (
                  <div className="text-sm text-gray-400 mb-3">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    View Results
                  </button>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          "/api/quizzes/invite-all",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ quizId: quiz._id }),
                            credentials: "include",
                          }
                        );
                        const data = await response.json();
                        if (data.success) {
                          alert("All students invited!");
                        } else {
                          alert(data.message || "Failed to invite students.");
                        }
                      } catch (err) {
                        alert("Error inviting students.");
                      }
                    }}
                  >
                    Invite Participants
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            You haven't created any quizzes yet.
          </p>
          <button
            onClick={handleCreateQuiz}
            className="bg-chestnut-500 text-white px-6 py-3 rounded hover:bg-chestnut-600"
          >
            Create Your First Quiz
          </button>
        </div>
      )}

      <div className="mt-8 mb-32">
        <h2 className="text-white text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
            <div className="text-3xl font-bold text-chestnut-400">
              {activeQuizzes.length}
            </div>
            <div className="text-sm text-gray-400">Total Quizzes</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
            <div className="text-3xl font-bold text-yellow-400">
              {activeQuizzes.reduce(
                (sum, quiz) =>
                  sum +
                  (quiz.participants
                    ? quiz.participants.filter((p) => p.status === "invited")
                        .length
                    : 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-400">Total Invited</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
            <div className="text-3xl font-bold text-green-400">
              {activeQuizzes.reduce(
                (sum, quiz) =>
                  sum +
                  (quiz.participants
                    ? quiz.participants.filter((p) => p.status === "completed")
                        .length
                    : 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-400">Total Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;

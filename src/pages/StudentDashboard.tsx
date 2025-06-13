import { useState, useEffect } from "react";

interface Participant {
  user: string;
  status: "invited" | "completed";
}

interface Quiz {
  _id: number;
  title: string;
  description?: string;
  inviteCode?: string;
  participants?: Participant[];
  createdAt?: string;
  createdBy?: {
    _id: string;
    name: string;
  };
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  lastLogin: string;
  isVerified: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

interface QuizResponse {
  success: boolean;
  message: string;
  data?: Quiz[];
}

function StudentDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [studentQuizzes, setStudentQuizzes] = useState<Quiz[]>([]);

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

  const fetchStudentQuizzes = async (userId: string) => {
    try {
      // Fetch quizzes where the user is a participant
      const response = await fetch(`/api/quizzes/student/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result: QuizResponse = await response.json();

      if (result.success && result.data) {
        setStudentQuizzes(result.data);
        console.log("Student Quizzes:", result.data);
      } else {
        setError(result.message || "Failed to fetch quizzes");
      }
    } catch (err) {
      console.error("Error fetching student quizzes:", err);
      setError("Failed to fetch quizzes");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?._id) {
      fetchStudentQuizzes(userInfo._id);
    }
  }, [userInfo]);

  const getCurrentUserQuizStatus = (quiz: Quiz) => {
    const currentUserId = userInfo?._id;
    const participation = quiz.participants?.find(
      (participant) => participant.user === currentUserId
    );
    return participation?.status;
  };

  const invitedQuizzes = studentQuizzes.filter(
    (quiz) => getCurrentUserQuizStatus(quiz) === "invited"
  );

  const completedQuizzes = studentQuizzes.filter(
    (quiz) => getCurrentUserQuizStatus(quiz) === "completed"
  );

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
  const copyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
    alert(`Invite code ${inviteCode} copied to clipboard!`);
  };
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

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
          <div className="text-3xl font-bold text-yellow-400">
            {invitedQuizzes.length}
          </div>
          <div className="text-sm text-gray-400">Pending Quizzes</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
          <div className="text-3xl font-bold text-green-400">
            {completedQuizzes.length}
          </div>
          <div className="text-sm text-gray-400">Completed Quizzes</div>
        </div>
      </div>

      {/* Quiz Invitations */}
      <h2 className="text-white text-xl font-semibold mt-6 mb-3">
        Quiz Invitations ({invitedQuizzes.length})
      </h2>
      {invitedQuizzes.length > 0 ? (
        <div className="grid gap-4 mb-8">
          {invitedQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white text-lg font-semibold">
                  {quiz.title}
                </h3>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">
                  Pending
                </span>
              </div>
              {quiz.description && (
                <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
              )}
              {quiz.createdBy && (
                <p className="text-gray-500 text-xs mb-3">
                  Created by: {quiz.createdBy.name}
                </p>
              )}
              {quiz.inviteCode && (
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Invite Code:</span>
                    <div className="bg-gray-700 px-3 py-2 rounded border border-gray-600 flex items-center gap-2">
                      <span className="text-white font-mono text-lg font-bold">
                        {quiz.inviteCode}
                      </span>
                      <button
                        onClick={() => copyInviteCode(quiz.inviteCode!)}
                        className="text-chestnut-400 hover:text-chestnut-300 text-sm ml-2"
                        title="Copy invite code"
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mb-8">No pending quiz invitations</p>
      )}

      {/* Quiz History */}
      <h2 className="text-white text-xl font-semibold mt-6 mb-3">
        Quiz History ({completedQuizzes.length})
      </h2>
      {completedQuizzes.length > 0 ? (
        <div className="grid gap-4">
          {completedQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white text-lg font-semibold">
                  {quiz.title}
                </h3>
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  Completed
                </span>
              </div>
              {quiz.description && (
                <p className="text-gray-400 text-sm mb-3">{quiz.description}</p>
              )}
              <div className="flex gap-2">
                <button className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No completed quizzes</p>
      )}
    </div>
  );
}

export default StudentDashboard;

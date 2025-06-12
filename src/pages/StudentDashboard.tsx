import { useState, useEffect } from "react";

interface Participant {
  user: string;
  status: "invited" | "completed";
  startTime?: string;
}

interface Quiz {
  _id: number;
  title: string;
  score?: string;
  participants?: Participant[];
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  quizzes: Quiz[];
  lastLogin: string;
  isVerified: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserInfo;
}

function StudentDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const getCurrentUserQuizStatus = (quiz: Quiz) => {
    const currentUserId = userInfo?._id;

    const participation = quiz.participants?.find(
      (participant) => participant.user === currentUserId
    );

    return participation?.status;
  };

  const completedQuizzes =
    userInfo?.quizzes?.filter(
      (quiz) => getCurrentUserQuizStatus(quiz) === "completed"
    ) || [];

  const quizInvites =
    userInfo?.quizzes?.filter(
      (quiz) => getCurrentUserQuizStatus(quiz) === "invited"
    ) || [];

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

      <h2 className="text-white text-xl font-semibold mt-6 mb-3">
        Quiz Invitations
      </h2>
      <ul>
        {quizInvites.length > 0 ? (
          quizInvites.map((invite) => (
            <li key={invite._id} className="p-2 border-b">
              {invite.title}{" "}
              <button className="ml-2 text-chestnut-500 hover:text-chestnut-700">
                Accept
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No new invites</p>
        )}
      </ul>

      <h2 className="text-white text-xl font-semibold mt-6 mb-3">
        Quiz History
      </h2>
      <ul>
        {completedQuizzes.length > 0 ? (
          completedQuizzes.map((quiz) => (
            <li key={quiz._id} className="p-2 border-b">
              {quiz.title} - Score: {quiz.score}
            </li>
          ))
        ) : (
          <p className="text-gray-400">No completed quizzes</p>
        )}
      </ul>
    </div>
  );
}

export default StudentDashboard;

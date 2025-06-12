import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Participant {
  user: string;
  status: "invited" | "completed";
  startTime?: string;
}

interface Quiz {
  id: number;
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

  // change password states
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordSuccess, setPasswordSuccess] = useState<string>("");

  // password visibility states
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError("");
      setPasswordSuccess("");

      const response = await fetch("/api/auth/change-password", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordSuccess(result.message);
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess("");
        }, 2000);
      } else {
        setPasswordError(result.message || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Network error occurred");
      console.error("Error changing password:", err);
    } finally {
      setPasswordLoading(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
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

        {userInfo.isVerified && (
          <button
            onClick={() => {
              setShowChangePassword(true);
              resetPasswordForm();
            }}
            className="bg-chestnut-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Change Password
          </button>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-90vw">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chestnut-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chestnut-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  At least 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-chestnut-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="mb-4 text-red-600 text-sm">{passwordError}</div>
              )}

              {passwordSuccess && (
                <div className="mb-4 text-green-600 text-sm">
                  {passwordSuccess}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-chestnut-500 text-white rounded hover:bg-chestnut-600 disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-400 mb-6">
        Last login: {new Date(userInfo.lastLogin).toLocaleDateString()}
      </div>

      <h2 className="text-white text-xl font-semibold mt-6 mb-3">
        Quiz Invitations
      </h2>
      <ul>
        {quizInvites.length > 0 ? (
          quizInvites.map((invite) => (
            <li key={invite.id} className="p-2 border-b">
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
            <li key={quiz.id} className="p-2 border-b">
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/api/auth/change-password`, {
        newPassword,
      });

      setMessage({
        type: "success",
        text: "Password successfully reset. Redirecting to login...",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

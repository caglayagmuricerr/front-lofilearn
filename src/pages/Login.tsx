import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const location = useLocation();
  const success = location.state?.successMessage;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!email.endsWith("@ogr.btu.edu.tr") && !email.endsWith("@btu.edu.tr")) {
      return "You must use a Bursa Technical University email address (@ogr.btu.edu.tr or @btu.edu.tr)";
    }
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.success) {
        if (formData.email.endsWith("@ogr.btu.edu.tr")) {
          navigate("/student-dashboard");
        } else if (formData.email.endsWith("@btu.edu.tr")) {
          navigate("/teacher-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 403) {
        setError("Please verify your email before logging in.");
      } else if (err.response?.status === 400) {
        setError("Please fill in all required fields.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 pb-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {success && (
          <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-chestnut-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-chestnut-400 hover:text-chestnut-300 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                University Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="mail@ogr.btu.edu.tr or mail@btu.edu.tr"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chestnut-300 focus:border-chestnut-300 transition-colors"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Use your Bursa Technical University email address
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-chestnut-300 focus:border-chestnut-300 transition-colors"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-chestnut-400 hover:text-chestnut-300 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

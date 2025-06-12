import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!email.endsWith("@ogr.btu.edu.tr") && !email.endsWith("@btu.edu.tr")) {
      return "You must use a Bursa Technical University email address (@ogr.btu.edu.tr or @btu.edu.tr)";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!password) return "Password is required";
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/send-reset-password-otp", {
        email: formData.email,
      });

      if (response.data.success) {
        setSuccess("Reset code sent to your email. Please check your inbox.");
        setStep(2);
      }
    } catch (err: any) {
      console.error("Send OTP error:", err.response?.data || err.message);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 404) {
        setError("No account found with this email address.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.otp) {
      setError("OTP is required");
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login", {
            state: {
              successMessage:
                "Password reset successfully. Please login with your new password.",
            },
          });
        }, 2000);
      }
    } catch (err: any) {
      console.error("Reset password error:", err.response?.data || err.message);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError("Invalid OTP or the OTP has expired. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 pb-32">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-chestnut-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 1 ? "Reset your password" : "Enter reset code"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 ? (
              <>
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-chestnut-400 hover:text-chestnut-300 transition-colors"
                >
                  Sign in
                </Link>
              </>
            ) : (
              "Enter the code sent to your email and your new password"
            )}
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

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
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
                Enter your Bursa Technical University email address
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending code...
                </div>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reset Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  placeholder="Enter the 6-digit code"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-chestnut-300 focus:border-chestnut-300 transition-colors"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  maxLength={6}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Check your email for the reset code (expires in 15 minutes)
                </p>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-chestnut-300 focus:border-chestnut-300 transition-colors"
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
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
                <p className="mt-1 text-xs text-gray-500">
                  At least 8 characters with uppercase, lowercase, and number
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Resetting...
                  </div>
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-chestnut-400 hover:text-chestnut-300 transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

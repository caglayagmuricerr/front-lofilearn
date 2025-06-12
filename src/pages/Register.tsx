import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, MailCheck, Eye, EyeOff } from "lucide-react";
import axios from "axios";

interface RegisterResponse {
  success: boolean;
  message: string;
  role?: string;
}

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setEmailCheckMessage("");

    try {
      // 1. First register the user
      const registerResponse = await axios.post<RegisterResponse>(
        "/api/auth/register",
        formData,
        {
          withCredentials: true,
        }
      );

      if (!registerResponse.data.success) {
        throw new Error(registerResponse.data.message);
      }

      // 2. Then send verification email
      try {
        const verificationResponse = await axios.post(
          "/api/auth/send-verification-otp",
          {},
          {
            withCredentials: true,
          }
        );

        if (!verificationResponse.data.success) {
          throw new Error(verificationResponse.data.message);
        }

        setEmailSent(true);
        setEmailCheckMessage(
          "Verification email sent! Please check your inbox (and spam folder)."
        );

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              email: formData.email,
              message: "Please enter the verification code sent to your email",
            },
          });
        }, 2000);
      } catch (verificationError: any) {
        // if registration succeeds but verification email sending fails
        setError(
          verificationError.response?.data?.message ||
            verificationError.message ||
            "Account created but failed to send verification email. Please try logging in to resend."
        );
      }
    } catch (err: any) {
      let errorMessage =
        err.response?.data?.message || err.message || "Registration failed";

      if (errorMessage.includes("Bursa Technical University")) {
        errorMessage +=
          " Please use your @btu.edu.tr or @ogr.btu.edu.tr email.";
      }

      setError(errorMessage);

      if (errorMessage.toLowerCase().includes("email")) {
        setEmailCheckMessage(
          "Please double-check your email address for typos."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    return email.endsWith("@btu.edu.tr") || email.endsWith("@ogr.btu.edu.tr");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          {emailSent ? (
            <MailCheck className="mx-auto h-12 w-12 text-chestnut-500" />
          ) : (
            <UserPlus className="mx-auto h-12 w-12 text-chestnut-400" />
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {emailSent ? "Registration Complete!" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {emailSent ? (
              emailCheckMessage
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-chestnut-400 hover:text-chestnut-300"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {emailCheckMessage && !error && (
          <div className="mb-4 p-3 text-sm text-chestnut-700 bg-chestnut-100 rounded-md border border-chestnut-200">
            {emailCheckMessage}
          </div>
        )}

        {!emailSent && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-chestnut-300 focus:border-chestnut-300"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-chestnut-300 ${
                    formData.email && !validateEmail(formData.email)
                      ? "border-red-300 focus:border-red-300"
                      : "border-gray-300 focus:border-chestnut-300"
                  }`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="mt-1 text-xs text-red-500">
                    Please use your @btu.edu.tr or @ogr.btu.edu.tr email
                  </p>
                )}
                {emailCheckMessage && (
                  <p className="mt-1 text-xs text-gray-500">
                    {emailCheckMessage}
                  </p>
                )}
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
                    autoComplete="new-password"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-chestnut-300 focus:border-chestnut-300"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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
                  Minimum 6 characters required
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                (formData.email ? !validateEmail(formData.email) : false)
              }
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-chestnut-400 hover:bg-chestnut-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chestnut-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Create account"}
            </button>
          </form>
        )}

        {emailSent && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You'll be redirected to verification shortly...
            </p>
            <p className="text-xs text-gray-500">
              Make sure you entered <strong>{formData.email}</strong> correctly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;

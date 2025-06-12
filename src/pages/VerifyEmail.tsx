import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, Mail, AlertCircle, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerifyEmailProps {
  onVerificationSuccess?: () => void;
  onResendOTP?: () => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  onVerificationSuccess,
  onResendOTP,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const pastedArray = pastedData.slice(0, 6).split("");

    const newOtp = [...otp];
    pastedArray.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const verifyEmail = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setMessage("Please enter all 6 digits");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include cookies in the request
        body: JSON.stringify({ otp: otpString }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message || "Email verified successfully!");

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate("/login");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        onVerificationSuccess?.();
      } else {
        setIsError(true);
        setMessage(data.message || "Verification failed");

        if (
          data.message?.includes("Invalid OTP") ||
          data.message?.includes("expired")
        ) {
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    } catch (error) {
      setIsError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/login");
  };

  const handleResendOTP = async () => {
    if (onResendOTP) {
      setMessage("");
      setIsError(false);
      setOtp(["", "", "", "", "", ""]);
      onResendOTP();
      inputRefs.current[0]?.focus();
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-chestnut-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email Verified!
          </h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to login page in {countdown} seconds...
          </p>
          <button
            onClick={handleContinue}
            className="bg-chestnut-400 hover:bg-chestnut-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-chestnut-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to your email address. Please
          enter it below.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-chestnut-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          ))}
        </div>

        {message && (
          <div
            className={`flex items-center justify-center space-x-2 mb-4 ${
              isError ? "text-red-600" : "text-green-600"
            }`}
          >
            {isError && <AlertCircle className="w-4 h-4" />}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <button
          onClick={verifyEmail}
          disabled={isLoading || otp.some((digit) => !digit)}
          className="w-full text-white bg-chestnut-400 hover:bg-chestnut-500 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResendOTP}
          disabled={isLoading}
          className="text-chestnut-500 hover:text-chestnut-600 font-semibold text-sm transition-colors"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;

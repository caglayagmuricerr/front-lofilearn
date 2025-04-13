import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setMessage("Email verified successfully! Redirecting...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMessage(data.message || "Verification failed.");
        }
      } catch (error: any) {
        setMessage(error?.message);
      }
      setLoading(false);
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading ? <p>Verifying your email...</p> : <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function SubscribeSuccess() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const session_id = searchParams.get("session_id");
        const token = localStorage.getItem("token");

        const res = await api.get(
          `/subscription/verify-session?session_id=${session_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Subscription activated successfully");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (error) {
        setMessage(error.response?.data?.message || "Verification failed");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Subscription Success</h1>
      <p className="mt-3">{message}</p>
    </div>
  );
}

export default SubscribeSuccess;
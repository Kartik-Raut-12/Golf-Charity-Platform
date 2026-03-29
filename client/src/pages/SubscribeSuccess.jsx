import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

function SubscribeSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("Verifying your premium activation...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const session_id = searchParams.get("session_id");

        // The token is now automatically handled by our API interceptor!
        const res = await api.get(
          `/subscription/verify-session?session_id=${session_id}`
        );

        localStorage.setItem("user", JSON.stringify(res.data.user));
        setStatus("success");
        setMessage("Your professional subscription is now active!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. Please try logging in again.");
      }
    };

    if (searchParams.get("session_id")) {
      verify();
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center relative overflow-hidden"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
        
        <div className="mb-8 flex justify-center">
          {status === "verifying" && (
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          )}
          {status === "success" && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
          {status === "error" && (
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 border border-red-500/30">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
          {status === "success" ? "Welcome Aboard!" : status === "error" ? "Verification Error" : "Processing..."}
        </h1>
        
        <p className="text-slate-400 font-medium mb-10 leading-relaxed text-lg">
          {message}
        </p>

        {status === "success" && (
          <div className="space-y-4">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 animate-pulse">
              Redirecting to Dashboard...
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col gap-4">
            <Link 
              to="/login" 
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              LOGIN AGAIN
            </Link>
            <Link to="/" className="text-slate-500 hover:text-white text-sm font-bold transition-colors">
              Return Home
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SubscribeSuccess;
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path 
     ? "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
     : "text-slate-400 hover:text-white transition-colors hover:glow";

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-950/80 sticky top-0 z-50 shadow-2xl backdrop-blur-md"
    >
      <Link to="/" className="text-xl font-extrabold tracking-tight text-white group flex items-center gap-2">
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center text-white"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </motion.div>
        Golf Charity <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all">Platform</span>
      </Link>

      <div className="flex gap-6 text-sm items-center font-medium">
        <Link to="/" className={isActive("/")}>Home</Link>
        <Link to="/charities" className={isActive("/charities")}>Charities</Link>

        {token ? (
          <>
            <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
            <Link to="/winnings" className={isActive("/winnings")}>Winnings</Link>
            {(user?.role === "admin" || user?.role === "superadmin") && <Link to="/admin" className={isActive("/admin")}>Admin</Link>}
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-800">
              <span className="text-sm text-slate-400">Hi, <strong className="text-white">{user?.full_name}</strong></span>
              
              {user?.subscription_status !== "active" && (
                <Link to="/subscribe" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-4 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all text-xs font-black uppercase tracking-wider">
                  Subscribe
                </Link>
              )}
              
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors text-xs uppercase font-bold tracking-wider hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 ml-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest shadow-inner">
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all font-black text-xs uppercase tracking-widest">
                Register
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
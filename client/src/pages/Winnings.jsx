import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function Winnings() {
  const [history, setHistory] = useState([]);
  const [winners, setWinners] = useState([]);
  const [myWinnings, setMyWinnings] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const [historyRes, winnersRes, myWinningsRes] = await Promise.all([
        api.get("/draw/history", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/draw/winners", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/winner/my", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setHistory(historyRes.data);
      setWinners(winnersRes.data);
      setMyWinnings(myWinningsRes.data);
    } catch (error) {
      toast.error("Failed to load platform data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (winnerId, file) => {
    setSelectedFiles((prev) => ({ ...prev, [winnerId]: file }));
  };

  const handleProofUpload = async (winnerId) => {
    try {
      const file = selectedFiles[winnerId];
      const token = localStorage.getItem("token");

      if (!file) return toast.error("Please select a file first");

      const formData = new FormData();
      formData.append("winnerId", winnerId);
      formData.append("proof", file);

      await api.post("/winner/upload-proof", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Proof uploaded successfully");
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "approved": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "rejected": return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "paid": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      default: return "bg-slate-800 text-slate-300 border border-slate-700";
    }
  };

  const totalWon = myWinnings
    .filter((w) => w.payment_status === "paid")
    .reduce((sum, w) => sum + (w.prize_amount || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-6xl mx-auto min-h-screen font-sans relative z-10 mt-4 space-y-12 pb-20"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg mb-2">
            Monthly <span className="neon-text-gradient">Draws</span>
          </h1>
          <p className="text-slate-400 md:text-lg font-medium">Review the official ledger and your personal victories.</p>
        </div>
        <div className="grid grid-cols-2 sm:flex gap-4 w-full sm:w-auto">
           <div className="bg-slate-950/60 p-4 sm:p-6 rounded-3xl border border-slate-800 flex-1 sm:min-w-[140px] text-center shadow-inner">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">My Total Payout</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">₹{totalWon.toLocaleString()}</p>
           </div>
           <div className="bg-slate-950/60 p-4 sm:p-6 rounded-3xl border border-slate-800 flex-1 sm:min-w-[140px] text-center shadow-inner">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">My Total Wins</p>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">{myWinnings.length}</p>
           </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card p-8 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 group-hover:bg-emerald-500/10"></div>
        <h2 className="text-xl font-black mb-10 text-white tracking-widest uppercase relative z-10">Personal Prize Ledger</h2>

        {loading ? (
          <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div></div>
        ) : myWinnings.length === 0 ? (
          <div className="bg-slate-900/50 rounded-3xl p-16 border border-dashed border-slate-700 text-center shadow-inner relative z-10">
            <p className="text-slate-600 font-extrabold text-lg uppercase tracking-widest group-hover:text-slate-500 transition-colors">No Claims Yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {myWinnings.map((winner) => (
              <div key={winner.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] hover:bg-slate-800 transition-all flex flex-col justify-between group/win">
                <div>
                  <div className="flex justify-between items-start border-b border-slate-700/40 pb-5 mb-5">
                    <div>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase shadow-sm inline-block mb-3">{winner.match_type} Match Status</span>
                      <p className="text-4xl font-black text-white">₹{winner.prize_amount?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase shadow-sm ${getStatusColor(winner.verification_status)}`}>{winner.verification_status}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase shadow-sm ${getStatusColor(winner.payment_status)}`}>{winner.payment_status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Draw Reference</p>
                    <p className="text-sm font-bold text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-inner">{winner.draws?.draw_month} {winner.draws?.draw_year}</p>
                  </div>
                </div>

                {winner.proof_url ? (
                  <a href={winner.proof_url} target="_blank" rel="noreferrer" className="flex justify-center items-center gap-2 bg-slate-950 px-4 py-4 rounded-2xl border border-slate-800 text-xs font-black uppercase text-cyan-400 tracking-widest hover:border-cyan-500/30 hover:shadow-lg transition-all">View Disbursement Proof</a>
                ) : (
                  <div className="space-y-4 pt-2">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Admin Verification Required</p>
                     <div className="flex gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner">
                        <label className="flex-1 bg-slate-900 border border-slate-800 text-slate-500 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-slate-600 transition-all text-center">
                          {selectedFiles[winner.id] ? selectedFiles[winner.id].name : "Select ID/Slip"}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(winner.id, e.target.files[0])} />
                        </label>
                        {selectedFiles[winner.id] && (
                          <button onClick={() => handleProofUpload(winner.id)} className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg">Upload</button>
                        )}
                     </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[2rem] h-fit">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-lg font-black text-white tracking-widest uppercase">History</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800">{history.length} Draws Listed</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {history.map((draw) => (
              <div key={draw.id} className="bg-slate-900/60 border border-slate-800 border-l-4 border-l-emerald-500/40 p-5 rounded-2xl hover:bg-slate-800 transition-all group">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xl font-black text-white">{draw.draw_month} {draw.draw_year}</p>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">{draw.draw_type} Draw</span>
                </div>
                <div className="flex flex-wrap gap-3">
                   {draw.winning_numbers?.map((num, i) => (
                      <span key={i} className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-sm shadow-inner border border-slate-800 group-hover:border-emerald-500/40 transition-all">
                        {num}
                      </span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[2rem] h-fit">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-lg font-black text-white tracking-widest uppercase">Hall of Fame</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800">Recent 10 Victories</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {winners.map((winner) => (
              <div key={winner.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:bg-slate-800 transition-all group/hof">
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/5">
                  <div>
                    <h4 className="font-black text-white text-lg group-hover/hof:text-cyan-400 transition-colors uppercase tracking-tight">{winner.users?.full_name}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{winner.draws?.draw_month} {winner.draws?.draw_year}</p>
                  </div>
                  <p className="text-2xl font-black text-emerald-400">₹{winner.prize_amount?.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{winner.match_type} Match</span>
                   </div>
                   <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${getStatusColor(winner.verification_status)}`}>{winner.verification_status}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${getStatusColor(winner.payment_status)}`}>{winner.payment_status}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Winnings;
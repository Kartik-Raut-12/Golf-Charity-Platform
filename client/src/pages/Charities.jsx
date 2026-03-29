import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function Charities() {
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState("");
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild;
      if (card) {
        const cardWidth = card.offsetWidth;
        const gap = 32;
        const scrollAmount = cardWidth + gap;
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [charities]);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get("/charity");
        setCharities(res.data);
      } catch (error) {
        toast.error("Failed to load charities");
      }
    };

    fetchCharities();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.charity_id) {
      setSelectedCharity(user.charity_id);
      setPercentage(user.charity_percentage || 10);
    }
  }, []);

  const handleSelect = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!selectedCharity) {
      toast.error("Please select a charity");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(
        "/charity/select",
        {
          charity_id: selectedCharity,
          charity_percentage: Number(percentage),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const oldUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...oldUser,
        charity_id: res.data.user.charity_id,
        charity_percentage: res.data.user.charity_percentage,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Impact settings updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
      className="p-6 max-w-6xl mx-auto font-sans relative z-10 space-y-12 mt-4 pb-20"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white tracking-tight drop-shadow-lg">
          Explore Listed <span className="neon-text-gradient">Charities</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          Select a charity to support and specify the contribution percentage from your subscription.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="relative group/carousel px-4">
        {/* Navigation Arrows */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("left")}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-[30] w-14 h-14 rounded-full glass-panel border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-110 hover:bg-emerald-500/10 transition-all duration-300 backdrop-blur-xl group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scroll("right")}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-[30] w-14 h-14 rounded-full glass-panel border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-110 hover:bg-emerald-500/10 transition-all duration-300 backdrop-blur-xl group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-emerald-500/5 rounded-[100%] blur-[120px] pointer-events-none"></div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-8 overflow-x-auto scroll-smooth pb-12 pt-4 no-scrollbar snap-x snap-mandatory"
        >
          {charities.map((charity) => (
            <div
              key={charity.id}
              className={`flex-none w-[calc((100%-64px)/3)] snap-start glass-card flex flex-col rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-2 relative group z-10 ${
                selectedCharity === charity.id
                  ? "border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-emerald-500/10 ring-2 ring-emerald-500/20"
                  : "border-slate-700/50 hover:border-emerald-500/30 bg-slate-900/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              }`}
              onClick={() => setSelectedCharity(charity.id)}
            >
              <div className="h-56 relative border-b border-slate-700/50 overflow-hidden">
                {charity.image_url ? (
                  <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                    <span className="text-slate-700 font-extrabold tracking-widest uppercase text-xs">Listed Charity</span>
                  </div>
                )}
                {selectedCharity === charity.id && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 bg-emerald-500 text-slate-950 p-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-start relative bg-slate-900/40">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-md">{charity.name}</h2>
                  <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed font-medium">{charity.description}</p>
                </div>
                {charity.featured && (
                  <span className="inline-block mt-5 text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg max-w-max font-black tracking-widest uppercase shadow-sm">
                    Featured Charity
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-10 glass-panel p-8 rounded-[2rem] max-w-3xl mx-auto border-t-2 border-t-emerald-500/50 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <label className="block mb-2 font-black text-white text-2xl tracking-tight">
          Contribution Commitment
        </label>
        <p className="text-sm text-slate-400 font-medium mb-10">Choose how much of your subscription goes to your selected charity. (Min 10%)</p>
        
        <div className="space-y-12">
           <div className="relative pt-1">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full h-4 bg-slate-950 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner border border-slate-800"
              />
              <div className="flex justify-between mt-4">
                 {[10, 25, 50, 75, 100].map(val => (
                   <span key={val} className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{val}%</span>
                 ))}
              </div>
           </div>

           <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/80 rounded-[2rem] px-8 py-4 shadow-inner">
                 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{percentage}%</span>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest vertical-rl">Selection</p>
              </div>
              
              <button
                onClick={handleSelect}
                disabled={loading || !selectedCharity}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 rounded-2xl px-16 py-4 font-black text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 uppercase tracking-wider"
              >
                {loading ? "Synching..." : "Confirm Settings"}
              </button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Charities;
import { Link } from "react-router-dom";

function Footer() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <footer className="relative z-10 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-xl font-black text-white tracking-tighter">Golf Charity <span className="text-emerald-400">Platform</span></span>
            </Link>
            <p className="text-slate-500 text-sm font-medium max-w-sm leading-relaxed">
              The world's first premium golf performance charity platform. Compete in monthly draws, win big, and drive social impact with every subscription.
            </p>
          </div>

          {isLoggedIn && (
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/charities" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Charities</Link></li>
                <li><Link to="/winnings" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Winnings</Link></li>
                <li><Link to="/subscribe" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Pricing</Link></li>
              </ul>
            </div>
          )}

          <div className={isLoggedIn ? "" : "col-span-2 md:col-span-1"}>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Rules of Play</Link></li>
              <li><Link to="/privacy" className="text-slate-500 hover:text-emerald-400 text-sm font-bold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/admin-login" className="text-slate-700 hover:text-slate-500 text-[10px] font-black uppercase tracking-widest transition-colors">Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
            © 2026 Golf Charity Platform. All Rights Reserved.
          </p>
          <div className="flex gap-6 uppercase text-[10px] font-black tracking-widest text-slate-600">
             <span>v2.4.0 High-End Build</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

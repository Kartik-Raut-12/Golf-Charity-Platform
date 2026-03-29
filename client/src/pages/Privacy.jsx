import { motion } from "framer-motion";

function Privacy() {
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
      className="p-6 max-w-4xl mx-auto font-sans relative z-10 mt-12 pb-32 space-y-12"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Data & <span className="neon-text-gradient">Privacy</span>
        </h1>
        <p className="text-slate-400 font-medium text-lg uppercase tracking-widest">Your Privacy Commitment</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card p-10 space-y-10 leading-relaxed text-slate-300 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 group-hover:bg-cyan-500/10"></div>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Information Collection</h2>
          <p>
            We collect personal information such as name, email address, and demographic data only after you provide explicit consent through registration. This data is used solely to facilitate prize draws and subscription management.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">2. Payment Integrity</h2>
          <p>
            All payment transactions are handled securely via Stripe. We do not store credit card or sensitive financial data on our servers. Stripe's world-class encrypted infrastructure ensures your billing information remains secure.
          </p>
        </section>

        <section className="space-y-4 border-l-4 border-cyan-500/50 pl-6 bg-cyan-500/5 py-6 rounded-r-2xl">
          <h2 className="text-xl font-black text-cyan-400 uppercase tracking-tight">3. Algorithmic Processing</h2>
          <p>
            The platform's draw algorithms may process aggregate user data (frequency of winning numbers, score trends) to maintain the platform's probabilistic logic. This data is anonymized and never linked to specific individuals outside of prize verification.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">4. Third-Party Sharing</h2>
          <p>
             We share anonymized metrics with our charity partners to demonstrate the social impact of our platform. Your private contact details are never shared with third parties for marketing purposes without your express permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">5. User Rights</h2>
          <p>
            You have the right to access, rectify, or delete your personal data at any time through your account settings or by contacting our support team. We store data only for as long as required to fulfill our legal obligations regarding prize history and taxation audits.
          </p>
        </section>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest pt-12">
        Last Updated: March 29, 2026 • © Golf Charity Platform
      </motion.div>
    </motion.div>
  );
}

export default Privacy;

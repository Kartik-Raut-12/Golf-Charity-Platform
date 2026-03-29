import { motion } from "framer-motion";

function Terms() {
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
          Rules of <span className="neon-text-gradient">Play</span>
        </h1>
        <p className="text-slate-400 font-medium text-lg uppercase tracking-widest">Platform Terms & Conditions</p>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card p-10 space-y-10 leading-relaxed text-slate-300">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">1. Eligibility</h2>
          <p>
            The Golf Charity Platform is open to individuals aged 18 and above. Participants must hold a valid identity document to claim prizes over a specific threshold. All entries are subject to verification from our administrative team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">2. Subscription & Entry</h2>
          <p>
            Participation in monthly draws requires an active subscription. Subscriptions are billed monthly or yearly as per your selection. You may cancel at any time through your dashboard; however, no partial refunds are provided for the current billing cycle.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">3. Draw Mechanisms</h2>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Random Draw:</strong> Standard probabilistic selection where every number has an equal weight.</li>
            <li><strong>Algorithmic Draw:</strong> Data-driven selection that may weight numbers based on historical user performance frequency across the platform.</li>
          </ul>
        </section>

        <section className="space-y-4 border-l-4 border-emerald-500/50 pl-6 bg-emerald-500/5 py-6 rounded-r-2xl">
          <h2 className="text-xl font-black text-emerald-400 uppercase tracking-tight">4. Prize Distribution</h2>
          <p>
            Prizes are allocated from the total subscription pool (40% Jackpot, 35% Tier 2, 25% Tier 3). If no Jackpot winner is found, the 40% pool rolls over to the following month's Jackpot. Winners must provide valid proof of identity and payment receipt to claim rewards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">5. Charity Contributions</h2>
          <p>
            Our platform commits a baseline of 10% of all subscription revenue to listed charities. Users can voluntarily increase this up to 100% via their dashboard settings. These contributions are managed and distributed by the platform to the user's selected charity partners monthly.
          </p>
        </section>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest pt-12">
        Last Updated: March 29, 2026 • © Golf Charity Platform
      </motion.div>
    </motion.div>
  );
}

export default Terms;

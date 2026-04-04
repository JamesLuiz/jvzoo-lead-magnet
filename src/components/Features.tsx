import { Zap, Target, TrendingUp, Clock, MousePointerClick, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, title: "One-Click Setup", desc: "Get started in minutes with zero technical skills required." },
  { icon: Target, title: "Laser-Targeted Traffic", desc: "Built-in audience targeting that finds buyers, not browsers." },
  { icon: TrendingUp, title: "Scale On Demand", desc: "Go from $0 to $1,000/day without increasing your workload." },
  { icon: Clock, title: "Full Automation", desc: "Set it once and let the software do the heavy lifting 24/7." },
  { icon: MousePointerClick, title: "Beginner Friendly", desc: "Designed for anyone — no experience or list needed to start." },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track every click, lead, and sale from one simple dashboard." },
];

const Features = () => (
  <section className="max-w-5xl mx-auto px-4 py-16 border-t border-border">
    <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">
      Why Marketers <span className="text-primary">Love</span> This Tool
    </h2>
    <p className="text-muted-foreground text-center mb-10">
      Everything you need to dominate your niche
    </p>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <f.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold mb-1">{f.title}</h3>
          <p className="text-muted-foreground text-sm">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Features;

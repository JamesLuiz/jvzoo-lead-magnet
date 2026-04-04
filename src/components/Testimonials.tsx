import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Marcus D.",
    role: "Affiliate Marketer",
    text: "This software literally changed my business overnight. I went from struggling to making consistent commissions daily.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Online Entrepreneur",
    text: "I was skeptical at first, but the results speak for themselves. Set it up in 10 minutes and saw my first sale the same day!",
    stars: 5,
  },
  {
    name: "James R.",
    role: "Digital Marketer",
    text: "Best investment I've made this year. The automation features alone save me 4+ hours every single day.",
    stars: 5,
  },
];

const Testimonials = () => (
  <section className="max-w-5xl mx-auto px-4 py-16">
    <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">
      What Our Users Are Saying
    </h2>
    <p className="text-muted-foreground text-center mb-10">
      Real results from real marketers
    </p>

    <div className="grid md:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: t.stars }).map((_, j) => (
              <Star key={j} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-foreground text-sm mb-4 leading-relaxed">"{t.text}"</p>
          <div>
            <p className="font-semibold text-sm">{t.name}</p>
            <p className="text-muted-foreground text-xs">{t.role}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;

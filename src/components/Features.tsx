import { Zap, Target, TrendingUp, Clock, MousePointerClick, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const iconMap = [Zap, Target, TrendingUp, Clock, MousePointerClick, BarChart3];

const Features = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 border-t border-border">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">
        {settings.featuresHeading.includes("Love") ? (
          <>Why Marketers <span className="text-primary">Love</span> This Tool</>
        ) : settings.featuresHeading}
      </h2>
      <p className="text-muted-foreground text-center mb-10">{settings.featuresSubheading}</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {settings.features.map((f, i) => {
          const Icon = iconMap[i % iconMap.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;

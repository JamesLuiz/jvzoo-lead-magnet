import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const Testimonials = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2">
        {settings.testimonialsHeading}
      </h2>
      <p className="text-muted-foreground text-center mb-10">
        {settings.testimonialsSubheading}
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {settings.testimonials.map((t, i) => (
          <motion.div
            key={i}
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
};

export default Testimonials;

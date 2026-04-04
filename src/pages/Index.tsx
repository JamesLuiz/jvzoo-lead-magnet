import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Shield, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const JVZOO_AFFILIATE_URL = "https://www.jvzoo.com"; // Replace with your affiliate link

const Index = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setIsSubmitting(true);

    // Simulate saving lead then redirect
    setTimeout(() => {
      window.open(JVZOO_AFFILIATE_URL, "_blank");
      setIsSubmitting(false);
      toast.success("Redirecting you now...");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              Limited Time Offer — Act Now
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-center leading-tight mb-4"
          >
            Unlock The{" "}
            <span className="text-primary">#1 Software</span>
            <br />
            That Prints Profits On Autopilot
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-center text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Watch the demo below to see how thousands of marketers are scaling their income with this breakthrough tool.
          </motion.p>

          {/* Video + Form Grid */}
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Video - takes 3 cols */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3"
            >
              <div className="relative rounded-xl overflow-hidden border border-border bg-card aspect-video flex items-center justify-center group cursor-pointer">
                {/* Placeholder — replace src with your video embed */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground text-sm">Click to play demo</p>
                </div>
              </div>
            </motion.div>

            {/* Form - takes 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2"
            >
              <div className="rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="text-xl font-bold mb-1">Get Instant Access</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Enter your details below to watch the full training & grab your copy.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary border-border h-12 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Best Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-secondary border-border h-12 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all"
                  >
                    {isSubmitting ? (
                      "Redirecting..."
                    ) : (
                      <span className="flex items-center gap-2">
                        Get Access Now <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>

                <div className="flex items-center gap-2 mt-4 text-muted-foreground text-xs">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Your info is 100% secure. We hate spam too.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm"
          >
            {[
              { icon: Star, text: "4.9/5 Rating" },
              { icon: Zap, text: "10,000+ Users" },
              { icon: Shield, text: "30-Day Guarantee" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;

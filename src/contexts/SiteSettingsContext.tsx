import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface FeatureCard {
  title: string;
  desc: string;
}

export interface TestimonialCard {
  name: string;
  role: string;
  text: string;
  stars: number;
}

export interface SiteSettings {
  headline: string;
  subheadline: string;
  urgencyText: string;
  videoUrl: string;
  featuresHeading: string;
  featuresSubheading: string;
  features: FeatureCard[];
  testimonialsHeading: string;
  testimonialsSubheading: string;
  testimonials: TestimonialCard[];
  primaryColor: string; // HSL string like "32 100% 50%"
  backgroundColor: string;
  cardColor: string;
  foregroundColor: string;
  ctaHeadline: string;
  ctaSubheadline: string;
}

const defaultSettings: SiteSettings = {
  headline: "Unlock The #1 Software That Prints Profits On Autopilot",
  subheadline: "Watch the demo below to see how thousands of marketers are scaling their income with this breakthrough tool.",
  urgencyText: "⚡ Special Launch Price Ends In:",
  videoUrl: "",
  featuresHeading: "Why Marketers Love This Tool",
  featuresSubheading: "Everything you need to dominate your niche",
  features: [
    { title: "One-Click Setup", desc: "Get started in minutes with zero technical skills required." },
    { title: "Laser-Targeted Traffic", desc: "Built-in audience targeting that finds buyers, not browsers." },
    { title: "Scale On Demand", desc: "Go from $0 to $1,000/day without increasing your workload." },
    { title: "Full Automation", desc: "Set it once and let the software do the heavy lifting 24/7." },
    { title: "Beginner Friendly", desc: "Designed for anyone — no experience or list needed to start." },
    { title: "Real-Time Analytics", desc: "Track every click, lead, and sale from one simple dashboard." },
  ],
  testimonialsHeading: "What Our Users Are Saying",
  testimonialsSubheading: "Real results from real marketers",
  testimonials: [
    { name: "Marcus D.", role: "Affiliate Marketer", text: "This software literally changed my business overnight. I went from struggling to making consistent commissions daily.", stars: 5 },
    { name: "Sarah K.", role: "Online Entrepreneur", text: "I was skeptical at first, but the results speak for themselves. Set it up in 10 minutes and saw my first sale the same day!", stars: 5 },
    { name: "James R.", role: "Digital Marketer", text: "Best investment I've made this year. The automation features alone save me 4+ hours every single day.", stars: 5 },
  ],
  primaryColor: "32 100% 50%",
  backgroundColor: "0 0% 7%",
  cardColor: "0 0% 10%",
  foregroundColor: "0 0% 95%",
  ctaHeadline: "Ready To Start Profiting?",
  ctaSubheadline: "Don't miss this limited-time launch price. Join thousands of smart marketers who are already seeing results.",
};

const STORAGE_KEY = "site_settings";

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (s: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Apply color overrides as CSS variables
    const root = document.documentElement;
    root.style.setProperty("--primary", settings.primaryColor);
    root.style.setProperty("--accent", settings.primaryColor);
    root.style.setProperty("--ring", settings.primaryColor);
    root.style.setProperty("--background", settings.backgroundColor);
    root.style.setProperty("--card", settings.cardColor);
    root.style.setProperty("--foreground", settings.foregroundColor);
    root.style.setProperty("--card-foreground", settings.foregroundColor);
  }, [settings]);

  const updateSettings = (partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export { defaultSettings };

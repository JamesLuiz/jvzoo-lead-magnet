import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getApiBase } from "@/lib/api";

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

export const defaultSettings: SiteSettings = {
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

function applyServerPayload(data: unknown): SiteSettings {
  if (!data || typeof data !== "object") return { ...defaultSettings };
  const o = data as Partial<SiteSettings>;
  return {
    ...defaultSettings,
    ...o,
    features: Array.isArray(o.features) ? (o.features as FeatureCard[]) : defaultSettings.features,
    testimonials: Array.isArray(o.testimonials) ? (o.testimonials as TestimonialCard[]) : defaultSettings.testimonials,
  };
}

function loadFromLocalStorage(): SiteSettings | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return applyServerPayload(JSON.parse(saved));
  } catch {
    return null;
  }
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  updateSettings: (s: Partial<SiteSettings>) => void;
  saveSettings: (full: SiteSettings) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | null>(null);

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
};

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/site-settings`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          const next = applyServerPayload(data);
          setSettings(next);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
        } else if (!cancelled) {
          const local = loadFromLocalStorage();
          if (local) setSettings(local);
        }
      } catch {
        if (!cancelled) {
          const local = loadFromLocalStorage();
          if (local) setSettings(local);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }

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

  const saveSettings = async (full: SiteSettings) => {
    const key = import.meta.env.VITE_ADMIN_API_KEY?.trim();
    if (key) {
      const res = await fetch(`${getApiBase()}/api/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify(full),
      });
      const body = (await res.json().catch(() => ({}))) as {
        message?: string | string[];
      } & Record<string, unknown>;
      if (!res.ok) {
        const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
        throw new Error(typeof msg === "string" ? msg : "Could not save to server.");
      }
      setSettings(applyServerPayload(body));
    } else {
      setSettings(full);
    }
  };

  const resetSettings = async () => {
    const key = import.meta.env.VITE_ADMIN_API_KEY?.trim();
    if (key) {
      const res = await fetch(`${getApiBase()}/api/site-settings`, {
        method: "DELETE",
        headers: { "x-admin-key": key },
      });
      const body = (await res.json().catch(() => ({}))) as {
        message?: string | string[];
      } & Record<string, unknown>;
      if (!res.ok) {
        const msg = Array.isArray(body.message) ? body.message.join(", ") : body.message;
        throw new Error(typeof msg === "string" ? msg : "Could not reset on server.");
      }
      setSettings(applyServerPayload(body));
    } else {
      setSettings({ ...defaultSettings });
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{ settings, isLoading, updateSettings, saveSettings, resetSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

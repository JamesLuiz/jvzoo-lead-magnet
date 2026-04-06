import { useState, useEffect, useRef } from "react";
import { useSiteSettings, FeatureCard, TestimonialCard, defaultSettings } from "@/contexts/SiteSettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  // Convert HSL string to hex for the color picker
  const hslToHex = (hsl: string) => {
    try {
      const [h, s, l] = hsl.split(/\s+/).map((v) => parseFloat(v));
      const sN = s / 100;
      const lN = l / 100;
      const a = sN * Math.min(lN, 1 - lN);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = lN - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    } catch {
      return "#ff8c00";
    }
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
        case g: h = ((b - r) / d + 2) * 60; break;
        case b: h = ((r - g) / d + 4) * 60; break;
      }
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-foreground min-w-[140px]">{label}</label>
      <input
        type="color"
        value={hslToHex(value)}
        onChange={(e) => onChange(hexToHsl(e.target.value))}
        className="w-10 h-10 rounded border border-border cursor-pointer"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="H S% L%"
        className="flex-1 bg-secondary border-border text-foreground"
      />
    </div>
  );
};

const Admin = () => {
  const { settings, isLoading, saveSettings, resetSettings } = useSiteSettings();
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const prevLoading = useRef(true);

  useEffect(() => {
    if (prevLoading.current && !isLoading) {
      setLocalSettings(settings);
      prevLoading.current = false;
    }
  }, [isLoading, settings]);

  const update = <K extends keyof typeof localSettings>(key: K, val: typeof localSettings[K]) => {
    setLocalSettings((p) => ({ ...p, [key]: val }));
  };

  const updateFeature = (index: number, field: keyof FeatureCard, val: string) => {
    const updated = [...localSettings.features];
    updated[index] = { ...updated[index], [field]: val };
    update("features", updated);
  };

  const addFeature = () => {
    update("features", [...localSettings.features, { title: "New Feature", desc: "Description here" }]);
  };

  const removeFeature = (i: number) => {
    update("features", localSettings.features.filter((_, idx) => idx !== i));
  };

  const updateTestimonial = (index: number, field: keyof TestimonialCard, val: string | number) => {
    const updated = [...localSettings.testimonials];
    updated[index] = { ...updated[index], [field]: val };
    update("testimonials", updated);
  };

  const addTestimonial = () => {
    update("testimonials", [...localSettings.testimonials, { name: "New User", role: "Role", text: "Testimonial text", stars: 5 }]);
  };

  const removeTestimonial = (i: number) => {
    update("testimonials", localSettings.testimonials.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(localSettings);
      toast.success(
        import.meta.env.VITE_ADMIN_API_KEY?.trim()
          ? "Saved to server"
          : "Saved locally only — set VITE_ADMIN_API_KEY to persist on the server.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetSettings();
      setLocalSettings(defaultSettings);
      toast.success(
        import.meta.env.VITE_ADMIN_API_KEY?.trim()
          ? "Reset to defaults on the server"
          : "Reset locally — server unchanged without VITE_ADMIN_API_KEY.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-extrabold">Admin Panel</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={resetting || isLoading} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <Button onClick={handleSave} disabled={saving || isLoading} className="bg-primary text-primary-foreground font-bold">
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <Section title="Hero Section">
            <Field label="Headline">
              <Textarea
                value={localSettings.headline}
                onChange={(e) => update("headline", e.target.value)}
                className="bg-secondary border-border text-foreground"
                rows={2}
              />
            </Field>
            <Field label="Subheadline">
              <Textarea
                value={localSettings.subheadline}
                onChange={(e) => update("subheadline", e.target.value)}
                className="bg-secondary border-border text-foreground"
                rows={2}
              />
            </Field>
          </Section>

          {/* Urgency Bar */}
          <Section title="Urgency Bar">
            <Field label="Urgency Text">
              <Input
                value={localSettings.urgencyText}
                onChange={(e) => update("urgencyText", e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </Field>
          </Section>

          {/* Video */}
          <Section title="Video">
            <Field label="Video Embed URL (YouTube/Vimeo)">
              <Input
                value={localSettings.videoUrl}
                onChange={(e) => update("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="bg-secondary border-border text-foreground"
              />
            </Field>
            <p className="text-xs text-muted-foreground">
              Use the embed URL format. For YouTube: https://www.youtube.com/embed/VIDEO_ID
            </p>
          </Section>

          {/* Features */}
          <Section title="Features Section">
            <Field label="Section Heading">
              <Input
                value={localSettings.featuresHeading}
                onChange={(e) => update("featuresHeading", e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </Field>
            <Field label="Section Subheading">
              <Input
                value={localSettings.featuresSubheading}
                onChange={(e) => update("featuresSubheading", e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </Field>
            <div className="space-y-3 mt-4">
              {localSettings.features.map((f, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Feature {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(i)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    value={f.title}
                    onChange={(e) => updateFeature(i, "title", e.target.value)}
                    placeholder="Title"
                    className="bg-secondary border-border text-foreground"
                  />
                  <Textarea
                    value={f.desc}
                    onChange={(e) => updateFeature(i, "desc", e.target.value)}
                    placeholder="Description"
                    className="bg-secondary border-border text-foreground"
                    rows={2}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addFeature} className="gap-2 w-full">
                <Plus className="w-4 h-4" /> Add Feature
              </Button>
            </div>
          </Section>

          {/* Testimonials */}
          <Section title="Testimonials Section">
            <Field label="Section Heading">
              <Input
                value={localSettings.testimonialsHeading}
                onChange={(e) => update("testimonialsHeading", e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </Field>
            <Field label="Section Subheading">
              <Input
                value={localSettings.testimonialsSubheading}
                onChange={(e) => update("testimonialsSubheading", e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </Field>
            <div className="space-y-3 mt-4">
              {localSettings.testimonials.map((t, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Testimonial {i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeTestimonial(i)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={t.name}
                      onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                      placeholder="Name"
                      className="bg-secondary border-border text-foreground"
                    />
                    <Input
                      value={t.role}
                      onChange={(e) => updateTestimonial(i, "role", e.target.value)}
                      placeholder="Role"
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  <Textarea
                    value={t.text}
                    onChange={(e) => updateTestimonial(i, "text", e.target.value)}
                    placeholder="Testimonial text"
                    className="bg-secondary border-border text-foreground"
                    rows={2}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addTestimonial} className="gap-2 w-full">
                <Plus className="w-4 h-4" /> Add Testimonial
              </Button>
            </div>
          </Section>

          {/* CTA Section */}
          <Section title="Final CTA Section">
            <Field label="CTA Headline">
              <Input
                value={localSettings.ctaHeadline}
                onChange={(e) => update("ctaHeadline", e.target.value)}
                className="bg-secondary border-border text-foreground"
              />
            </Field>
            <Field label="CTA Subheadline">
              <Textarea
                value={localSettings.ctaSubheadline}
                onChange={(e) => update("ctaSubheadline", e.target.value)}
                className="bg-secondary border-border text-foreground"
                rows={2}
              />
            </Field>
          </Section>

          {/* Colors */}
          <Section title="Page Colors">
            <div className="space-y-4">
              <ColorInput label="Primary / Accent" value={localSettings.primaryColor} onChange={(v) => update("primaryColor", v)} />
              <ColorInput label="Background" value={localSettings.backgroundColor} onChange={(v) => update("backgroundColor", v)} />
              <ColorInput label="Card Background" value={localSettings.cardColor} onChange={(v) => update("cardColor", v)} />
              <ColorInput label="Text Color" value={localSettings.foregroundColor} onChange={(v) => update("foregroundColor", v)} />
            </div>
          </Section>
        </div>

        {/* Bottom Save */}
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset} disabled={resetting || isLoading} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Reset All
          </Button>
          <Button onClick={handleSave} disabled={saving || isLoading} className="bg-primary text-primary-foreground font-bold px-8">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-6">
    <h2 className="text-lg font-bold mb-4 text-primary">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-sm font-medium text-muted-foreground mb-1 block">{label}</label>
    {children}
  </div>
);

export default Admin;

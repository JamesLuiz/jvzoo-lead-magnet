import { useState, useEffect } from "react";

const COUNTDOWN_HOURS = 2;

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem("countdown_end");
    if (saved) {
      const diff = Math.max(0, Math.floor((Number(saved) - Date.now()) / 1000));
      return diff;
    }
    const end = Date.now() + COUNTDOWN_HOURS * 60 * 60 * 1000;
    localStorage.setItem("countdown_end", String(end));
    return COUNTDOWN_HOURS * 60 * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const Block = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-2xl md:text-3xl font-extrabold text-primary tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      <Block value={hours} label="Hrs" />
      <span className="text-primary text-2xl font-bold">:</span>
      <Block value={minutes} label="Min" />
      <span className="text-primary text-2xl font-bold">:</span>
      <Block value={seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;

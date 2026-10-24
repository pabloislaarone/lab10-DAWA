"use client";

import { useEffect, useState } from "react";

interface StatCounterProps {
  value: number;
  label: string;
  accent: string; // clase de color del número
  delay?: number; // ms
}

// Contador animado: sube de 0 hasta el valor usando useState + useEffect
export default function StatCounter({ value, label, accent, delay = 0 }: StatCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1400;
    let start: number | null = null;

    const timeout = setTimeout(() => {
      const step = (time: number) => {
        if (start === null) start = time;
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * value));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [value, delay]);

  return (
    <div
      className="animate-fade-up bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md hover:border-portal/50 transition"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className={`font-rick text-4xl tracking-wide ${accent}`}>{count}</p>
      <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</p>
    </div>
  );
}

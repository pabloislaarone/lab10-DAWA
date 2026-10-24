interface PortalVisualProps {
  size?: string; // clases de tamaño de Tailwind
}

// Portal verde animado hecho solo con CSS (capas de gradientes girando)
export default function PortalVisual({ size = "w-64 h-64" }: PortalVisualProps) {
  return (
    <div aria-hidden className={`relative ${size} animate-float`}>
      <div className="absolute inset-0 rounded-full blur-2xl opacity-70 bg-portal/60" />
      <div className="absolute inset-0 rounded-full animate-portal-spin-fast bg-[conic-gradient(from_0deg,#c6f36b,#1f5f3a,#97ce4c,#0b3d2e,#c6f36b)]" />
      <div className="absolute inset-[10%] rounded-full animate-portal-spin [animation-direction:reverse] bg-[conic-gradient(from_180deg,#97ce4c,#064e3b,#c6f36b,#14532d,#97ce4c)] opacity-90" />
      <div className="absolute inset-[24%] rounded-full animate-portal-spin-fast bg-[conic-gradient(from_45deg,#ecfccb,#97ce4c,#1f5f3a,#ecfccb)] blur-[2px]" />
      <div className="absolute inset-[38%] rounded-full bg-[radial-gradient(circle,#f7fee7,#c6f36b_45%,transparent_70%)]" />
    </div>
  );
}

// Fondo animado del multiverso: estrellas en movimiento + resplandores de portal girando
export default function PortalBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#04060b]">
      <div className="starfield animate-stars absolute inset-0 opacity-70" />

      <div className="absolute -top-[30vmax] -right-[25vmax] w-[70vmax] h-[70vmax] rounded-full opacity-30 blur-[110px] animate-portal-spin bg-[conic-gradient(from_0deg,#97ce4c,#0b3d2e,#c6f36b,#1f5f3a,#97ce4c)]" />
      <div className="absolute -bottom-[35vmax] -left-[25vmax] w-[60vmax] h-[60vmax] rounded-full opacity-20 blur-[120px] animate-portal-spin [animation-direction:reverse] bg-[conic-gradient(from_90deg,#14b8a6,#97ce4c,#064e3b,#14b8a6)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#04060b_100%)]" />
    </div>
  );
}

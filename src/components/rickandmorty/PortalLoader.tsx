interface PortalLoaderProps {
  text?: string;
}

export default function PortalLoader({ text = "Abriendo portal..." }: PortalLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full animate-portal-spin-fast bg-[conic-gradient(from_0deg,transparent,#97ce4c,#c6f36b,transparent_70%)]" />
        <div className="absolute inset-[6px] rounded-full bg-[#04060b]" />
        <div className="absolute inset-[18px] rounded-full bg-portal/40 blur-md animate-pulse" />
      </div>
      <p className="text-portal-light font-rick tracking-widest text-xl animate-pulse">{text}</p>
    </div>
  );
}

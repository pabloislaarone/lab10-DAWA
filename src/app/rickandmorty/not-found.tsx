import Link from "next/link";
import PortalVisual from "@/components/rickandmorty/PortalVisual";

export default function CharacterNotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6">
      <PortalVisual size="w-48 h-48" />
      <h1 className="font-rick text-8xl text-portal tracking-wider mt-8 animate-glow">404</h1>
      <p
        className="animate-fade-up font-rick text-3xl tracking-wide mt-2"
        style={{ animationDelay: "100ms" }}
      >
        Este personaje se perdió en otra dimensión
      </p>
      <p className="animate-fade-up text-gray-400 mt-3 max-w-md" style={{ animationDelay: "200ms" }}>
        No existe en ninguna realidad conocida. Puede que el portal lo haya enviado a la Dimensión C-137
        equivocada.
      </p>
      <Link
        href="/rickandmorty"
        className="animate-fade-up mt-8 bg-portal hover:bg-portal-light text-black font-rick text-xl tracking-widest py-3 px-8 rounded-full transition shadow-[0_0_30px_rgb(151_206_76/0.5)]"
        style={{ animationDelay: "300ms" }}
      >
        Volver al multiverso
      </Link>
    </div>
  );
}

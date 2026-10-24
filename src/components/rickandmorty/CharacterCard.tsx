import Link from "next/link";
import Image from "next/image";
import { Character } from "@/types/character";
import { statusStyles } from "@/lib/rickandmorty";

interface CharacterCardProps {
  character: Character;
  index?: number;
  reveal?: "scroll" | "mount"; // scroll: aparece al hacer scroll · mount: aparece al cargar
}

export default function CharacterCard({ character, index = 0, reveal = "scroll" }: CharacterCardProps) {
  const status = statusStyles[character.status];

  return (
    <div
      className={reveal === "scroll" ? "card-reveal" : "animate-fade-up"}
      style={reveal === "mount" ? { animationDelay: `${(index % 20) * 45}ms` } : undefined}
    >
      <Link
        href={`/rickandmorty/${character.id}`}
        className="group relative block h-full rounded-2xl p-px overflow-hidden transition duration-300 hover:-translate-y-2"
      >
        {/* Borde de portal que gira al pasar el mouse */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-portal-spin-fast bg-[conic-gradient(from_0deg,transparent_0%,#97ce4c_10%,#c6f36b_20%,transparent_35%,transparent_50%,#97ce4c_60%,#c6f36b_70%,transparent_85%)]"
        />
        <span
          aria-hidden
          className="absolute inset-px rounded-2xl bg-white/10 group-hover:bg-transparent transition"
        />

        <div className="relative h-full rounded-2xl bg-[#0b1118]/95 overflow-hidden group-hover:shadow-[0_0_40px_-5px_rgb(151_206_76/0.55)] transition-shadow duration-500">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              loading="lazy" // carga de imágenes bajo demanda (Lazy Loading)
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-2"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0b1118] via-transparent to-transparent" />

            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-portal-light text-xs font-bold px-2.5 py-1 rounded-full border border-portal/30">
              #{character.id}
            </span>

            <span
              className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${status.pill}`}
            >
              <span className="relative flex w-2 h-2">
                {character.status === "Alive" && (
                  <span
                    className={`absolute inline-flex w-full h-full rounded-full ${status.dot} opacity-75 animate-ping`}
                  />
                )}
                <span className={`relative inline-flex w-2 h-2 rounded-full ${status.dot}`} />
              </span>
              {status.label}
            </span>
          </div>

          <div className="relative px-4 pb-4 -mt-6">
            <h2 className="font-rick text-2xl tracking-wide text-white truncate group-hover:text-portal-light transition">
              {character.name}
            </h2>
            <p className="text-sm text-gray-400">
              {character.species}
              {character.type && <span className="text-gray-500"> · {character.type}</span>}
            </p>
            <p className="text-xs text-gray-500 mt-3 uppercase tracking-wider">Última ubicación</p>
            <p className="text-sm text-gray-300 truncate">{character.location.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

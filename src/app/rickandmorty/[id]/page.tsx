import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { IoArrowBack, IoChevronBack, IoChevronForward, IoOpenOutline } from "react-icons/io5";
import { Episode } from "@/types/character";
import {
  genderLabels,
  getCharacter,
  getCharactersCount,
  getEpisodeNumber,
  getEpisodes,
  statusStyles,
} from "@/lib/rickandmorty";

// ISR: cada página de personaje se vuelve a generar como máximo cada 10 días (60 * 60 * 24 * 10)
export const revalidate = 864000;

interface CharacterPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Genera las rutas estáticas por Id para el total de personajes (SSG)
export async function generateStaticParams() {
  const count = await getCharactersCount();

  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Metadata dinámica para cada personaje
export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) return { title: "Personaje no encontrado - Rick and Morty" };

  return {
    title: `${character.name} - Rick and Morty`,
    description: `${character.name}: ${character.species} (${character.status}) originario de ${character.origin.name}`,
  };
}

// Agrupa los episodios por temporada: "S01E05" -> temporada 1
function groupBySeason(episodes: Episode[]) {
  return episodes.reduce<Record<string, Episode[]>>((acc, ep) => {
    const season = String(Number(ep.episode.slice(1, 3)));
    (acc[season] ??= []).push(ep);
    return acc;
  }, {});
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) notFound();

  const [episodes, total] = await Promise.all([getEpisodes(character.episode), getCharactersCount()]);

  const status = statusStyles[character.status];
  const seasons = groupBySeason(episodes);

  const createdAt = new Date(character.created).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const fields = [
    { label: "Especie", value: character.species },
    { label: "Tipo", value: character.type || "Sin tipo" },
    { label: "Género", value: genderLabels[character.gender] },
    { label: "Estado", value: status.label },
    { label: "Origen", value: character.origin.name },
    { label: "Última ubicación", value: character.location.name },
    { label: "Episodios", value: `${character.episode.length}` },
    { label: "Registrado en la API", value: createdAt },
  ];

  const apiLinks = [
    { label: "Personaje", url: character.url },
    { label: "Origen", url: character.origin.url },
    { label: "Ubicación", url: character.location.url },
  ];

  const prevId = character.id > 1 ? character.id - 1 : null;
  const nextId = character.id < total ? character.id + 1 : null;

  return (
    <div className="px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/rickandmorty"
          className="animate-fade-in inline-flex items-center gap-2 text-gray-400 hover:text-portal-light transition mb-8"
        >
          <IoArrowBack /> Volver a los personajes
        </Link>

        {/* Hero del personaje */}
        <section className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="animate-fade-up relative mx-auto w-64 h-64 md:w-80 md:h-80">
            {/* Anillo de portal girando detrás de la foto */}
            <div className="absolute -inset-5 rounded-full blur-xl opacity-60 bg-portal/50 animate-pulse" />
            <div className="absolute -inset-3 rounded-full animate-portal-spin-fast bg-[conic-gradient(from_0deg,#c6f36b,#1f5f3a,#97ce4c,transparent,#c6f36b)]" />
            <div className="absolute -inset-1 rounded-full bg-[#04060b]" />
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              priority
              className="relative w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="animate-fade-up text-portal uppercase tracking-[0.3em] text-sm font-semibold">
              Personaje #{character.id}
            </p>
            <h1
              className="animate-fade-up font-rick text-6xl md:text-7xl tracking-wide leading-none mt-2"
              style={{ animationDelay: "80ms" }}
            >
              {character.name}
            </h1>

            <div
              className="animate-fade-up flex flex-wrap justify-center md:justify-start gap-2 mt-5"
              style={{ animationDelay: "160ms" }}
            >
              <span
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-semibold ${status.pill}`}
              >
                <span className="relative flex w-2.5 h-2.5">
                  {character.status === "Alive" && (
                    <span
                      className={`absolute inline-flex w-full h-full rounded-full ${status.dot} opacity-75 animate-ping`}
                    />
                  )}
                  <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${status.dot}`} />
                </span>
                {status.label}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 font-semibold">
                {character.species}
              </span>
              <span className="px-4 py-1.5 rounded-full border border-white/15 bg-white/5 font-semibold">
                {genderLabels[character.gender]}
              </span>
            </div>

            <p className="animate-fade-up text-gray-400 mt-5 max-w-xl" style={{ animationDelay: "240ms" }}>
              Visto por última vez en <span className="text-portal-light">{character.location.name}</span>.
              Originario de <span className="text-portal-light">{character.origin.name}</span> y aparece en{" "}
              {character.episode.length} episodio(s).
            </p>
          </div>
        </section>

        {/* Todos los campos del personaje */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
          {fields.map((field, index) => (
            <div
              key={field.label}
              className="animate-fade-up group bg-white/4 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-portal/60 hover:-translate-y-1 hover:shadow-[0_0_30px_-8px_rgb(151_206_76/0.6)] transition duration-300"
              style={{ animationDelay: `${300 + index * 60}ms` }}
            >
              <p className="text-xs uppercase tracking-widest text-gray-500">{field.label}</p>
              <p className="text-lg font-semibold mt-1 group-hover:text-portal-light transition">
                {field.value}
              </p>
            </div>
          ))}
        </section>

        {/* Episodios por temporada */}
        <section
          className="animate-fade-up mt-14 bg-white/3 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md"
          style={{ animationDelay: "700ms" }}
        >
          <h2 className="font-rick text-4xl tracking-wide">
            Aparece en <span className="text-portal">{character.episode.length}</span> episodio(s)
          </h2>

          {episodes.length > 0 ? (
            <div className="space-y-6 mt-6">
              {Object.entries(seasons).map(([season, list]) => (
                <div key={season}>
                  <p className="text-sm uppercase tracking-widest text-portal-light mb-3">
                    Temporada {season}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {list.map((ep) => (
                      <a
                        key={ep.id}
                        href={ep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 bg-black/30 border border-white/10 rounded-xl px-4 py-3 hover:border-portal hover:bg-portal/10 transition"
                      >
                        <span className="font-rick text-lg tracking-wide text-portal group-hover:animate-wobble">
                          {ep.episode}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{ep.name}</span>
                          <span className="block text-xs text-gray-500">{ep.air_date}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-6">
              {character.episode.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-portal/10 border border-portal/30 text-portal-light hover:bg-portal hover:text-black text-sm font-semibold px-3 py-1 rounded-full transition"
                >
                  Ep. {getEpisodeNumber(url)}
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Enlaces de la API */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {apiLinks.map((link) => (
            <div key={link.label} className="bg-white/3 border border-white/10 rounded-2xl p-4 text-sm">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{link.label} (API)</p>
              {link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-portal hover:text-portal-light break-all transition"
                >
                  {link.url} <IoOpenOutline className="shrink-0" />
                </a>
              ) : (
                <p className="text-gray-500">No disponible</p>
              )}
            </div>
          ))}
        </section>

        {/* Navegación entre personajes */}
        <nav className="flex items-center justify-between gap-4 mt-12">
          {prevId ? (
            <Link
              href={`/rickandmorty/${prevId}`}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-portal hover:text-portal-light rounded-full py-3 px-6 font-semibold transition"
            >
              <IoChevronBack /> #{prevId}
            </Link>
          ) : (
            <span />
          )}

          <Link
            href="/rickandmorty"
            className="bg-portal hover:bg-portal-light text-black font-rick text-xl tracking-widest py-3 px-8 rounded-full transition shadow-[0_0_30px_rgb(151_206_76/0.45)] hover:shadow-[0_0_45px_rgb(151_206_76/0.8)]"
          >
            Multiverso
          </Link>

          {nextId ? (
            <Link
              href={`/rickandmorty/${nextId}`}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-portal hover:text-portal-light rounded-full py-3 px-6 font-semibold transition"
            >
              #{nextId} <IoChevronForward />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}

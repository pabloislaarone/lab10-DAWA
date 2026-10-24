import { getAllCharacters } from "@/lib/rickandmorty";
import CharacterCard from "@/components/rickandmorty/CharacterCard";
import CharacterSearch from "@/components/rickandmorty/CharacterSearch";
import PortalVisual from "@/components/rickandmorty/PortalVisual";
import StatCounter from "@/components/rickandmorty/StatCounter";

// Página principal: Server Component (SSR) con la petición en caché forzada (SSG)
export default async function RickAndMortyPage() {
  const characters = await getAllCharacters();

  const alive = characters.filter((c) => c.status === "Alive").length;
  const dead = characters.filter((c) => c.status === "Dead").length;
  const species = new Set(characters.map((c) => c.species)).size;

  return (
    <div className="px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-10 mb-12">
          <div>
            <p className="animate-fade-up text-portal uppercase tracking-[0.3em] text-sm font-semibold">
              Base de datos interdimensional
            </p>
            <h1
              className="animate-fade-up font-rick text-6xl md:text-8xl leading-none tracking-wide mt-3"
              style={{ animationDelay: "80ms" }}
            >
              Personajes del <span className="text-portal animate-glow">Multiverso</span>
            </h1>
            <p
              className="animate-fade-up text-gray-400 text-lg max-w-xl mt-5"
              style={{ animationDelay: "160ms" }}
            >
              Cruza el portal y explora a todos los habitantes de la serie. La lista se genera en el servidor
              y la búsqueda se hace en tiempo real desde tu navegador.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              <StatCounter
                value={characters.length}
                label="Personajes"
                accent="text-portal-light"
                delay={200}
              />
              <StatCounter value={alive} label="Vivos" accent="text-emerald-400" delay={300} />
              <StatCounter value={dead} label="Muertos" accent="text-red-400" delay={400} />
              <StatCounter value={species} label="Especies" accent="text-teal-300" delay={500} />
            </div>
          </div>

          <div className="hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
            <PortalVisual size="w-80 h-80" />
          </div>
        </header>

        <CharacterSearch>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {characters.map((character, index) => (
              <CharacterCard key={character.id} character={character} index={index} />
            ))}
          </div>
        </CharacterSearch>
      </div>
    </div>
  );
}

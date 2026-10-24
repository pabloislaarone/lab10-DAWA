"use client";

import { ReactNode, useEffect, useState } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
import { ApiInfo, Character, CharacterFilters, CharacterListResponse } from "@/types/character";
import { API_URL } from "@/lib/rickandmorty";
import CharacterCard from "./CharacterCard";
import PortalLoader from "./PortalLoader";

interface CharacterSearchProps {
  children: ReactNode; // lista generada en el servidor (se muestra cuando no hay búsqueda)
}

const emptyFilters: CharacterFilters = { name: "", status: "", type: "", gender: "" };

const statusOptions = [
  { value: "", label: "Todos" },
  { value: "alive", label: "Vivo" },
  { value: "dead", label: "Muerto" },
  { value: "unknown", label: "Desconocido" },
];

const genderOptions = [
  { value: "", label: "Todos" },
  { value: "female", label: "Femenino" },
  { value: "male", label: "Masculino" },
  { value: "genderless", label: "Sin género" },
  { value: "unknown", label: "Desconocido" },
];

export default function CharacterSearch({ children }: CharacterSearchProps) {
  const [filters, setFilters] = useState<CharacterFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Character[]>([]);
  const [info, setInfo] = useState<ApiInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSearching = Object.values(filters).some((value) => value.trim() !== "");

  // CSR: cada vez que cambian los filtros (o la página) se consulta la API desde el navegador
  useEffect(() => {
    if (!isSearching) return;

    const controller = new AbortController();

    // Debounce: espera 400 ms después de la última tecla antes de buscar
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ page: String(page) });
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim() !== "") params.append(key, value.trim());
      });

      try {
        const res = await fetch(`${API_URL}/character/?${params.toString()}`, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          setResults([]);
          setInfo(null);
          setError("Ningún personaje de este multiverso coincide con tu búsqueda.");
          return;
        }
        if (!res.ok) throw new Error("Error al buscar personajes");

        const data: CharacterListResponse = await res.json();
        setResults((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setInfo(data.info);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("El portal falló al conectarse con la API. Intenta de nuevo.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page, isSearching]);

  const handleChange = (field: keyof CharacterFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
    setResults([]);
    setInfo(null);
    setError(null);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setPage(1);
    setResults([]);
    setInfo(null);
    setError(null);
  };

  const inputClass =
    "w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-portal focus:ring-4 focus:ring-portal/20 focus:shadow-[0_0_25px_-5px_rgb(151_206_76/0.6)] transition placeholder:text-gray-500";

  const chipClass = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-sm font-semibold border transition duration-300 cursor-pointer ${
      active
        ? "bg-portal text-black border-portal shadow-[0_0_18px_rgb(151_206_76/0.6)] scale-105"
        : "bg-white/5 text-gray-300 border-white/10 hover:border-portal/60 hover:text-white"
    }`;

  return (
    <div>
      {/* Panel de búsqueda */}
      <section
        className="animate-fade-up relative bg-white/4 border border-white/10 rounded-3xl p-5 md:p-6 mb-10 backdrop-blur-xl"
        style={{ animationDelay: "250ms" }}
      >
        <p className="font-rick text-xl tracking-widest text-portal-light mb-4">Escanear el multiverso</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-portal" size={20} />
            <input
              type="text"
              placeholder="Nombre: Rick, Morty, Summer..."
              value={filters.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`${inputClass} pl-11`}
            />
          </div>
          <input
            type="text"
            placeholder="Tipo: Parasite, Robot, Clone..."
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Estado</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleChange("status", option.value)}
                  className={chipClass(filters.status === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Género</p>
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleChange("gender", option.value)}
                  className={chipClass(filters.gender === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isSearching && (
          <div className="animate-fade-in flex items-center justify-between mt-5 pt-4 border-t border-white/10 text-sm">
            <p className="text-gray-300">
              {loading && results.length === 0 ? (
                "Buscando en otras dimensiones..."
              ) : info ? (
                <>
                  <span className="font-rick text-lg text-portal-light tracking-wide">{info.count}</span>{" "}
                  personaje(s) encontrados
                </>
              ) : (
                ""
              )}
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-portal hover:text-portal-light font-semibold cursor-pointer transition"
            >
              <IoClose size={18} /> Limpiar filtros
            </button>
          </div>
        )}
      </section>

      {/* Sin búsqueda: lista renderizada en el servidor */}
      {!isSearching && children}

      {/* Con búsqueda: resultados obtenidos en el cliente (CSR) */}
      {isSearching && (
        <>
          {error && (
            <div className="animate-fade-up text-center py-20">
              <p className="font-rick text-4xl text-portal-light tracking-wide">¡Wubba lubba dub dub!</p>
              <p className="text-gray-400 mt-3">{error}</p>
            </div>
          )}

          {loading && results.length === 0 && <PortalLoader text="Buscando..." />}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((character, index) => (
              <CharacterCard key={character.id} character={character} index={index} reveal="mount" />
            ))}
          </div>

          {info?.next && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
                className="group relative bg-portal hover:bg-portal-light disabled:opacity-50 text-black font-rick text-xl tracking-widest py-3 px-10 rounded-full transition shadow-[0_0_30px_rgb(151_206_76/0.45)] hover:shadow-[0_0_45px_rgb(151_206_76/0.8)] cursor-pointer"
              >
                {loading ? "Abriendo portal..." : "Cargar más"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { Character, CharacterListResponse, Episode } from "@/types/character";

export const API_URL = "https://rickandmortyapi.com/api";

// 10 días en segundos (60 * 60 * 24 * 10)
export const TEN_DAYS = 864000;

// fetch con reintentos: si la API responde 429 (demasiadas peticiones) espera y reintenta.
// Útil en el build, donde se generan cientos de páginas seguidas.
async function apiFetch(url: string, init: RequestInit, retries = 3): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init);
    if (res.status !== 429 || attempt >= retries) return res;
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }
}

// Lista completa de personajes para la página principal.
// cache: "force-cache" -> la respuesta se guarda en caché y se reutiliza (SSG).
export async function getAllCharacters(): Promise<Character[]> {
  const firstRes = await apiFetch(`${API_URL}/character`, { cache: "force-cache" });
  if (!firstRes.ok) throw new Error("Error al cargar los personajes");

  const firstPage: CharacterListResponse = await firstRes.json();
  const characters = [...firstPage.results];

  // La API devuelve 20 personajes por página; pedimos el resto en grupos de 10 páginas
  const pages = Array.from({ length: firstPage.info.pages - 1 }, (_, i) => i + 2);

  for (let i = 0; i < pages.length; i += 10) {
    const group = pages.slice(i, i + 10);
    const responses = await Promise.all(
      group.map(async (page) => {
        const res = await apiFetch(`${API_URL}/character?page=${page}`, {
          cache: "force-cache",
        });
        if (!res.ok) throw new Error(`Error al cargar la página ${page}`);
        return (await res.json()) as CharacterListResponse;
      })
    );
    responses.forEach((data) => characters.push(...data.results));
  }

  return characters;
}

// Total de personajes: se usa para generar las rutas estáticas
export async function getCharactersCount(): Promise<number> {
  const res = await apiFetch(`${API_URL}/character`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Error al obtener el total de personajes");

  const data: CharacterListResponse = await res.json();
  return data.info.count;
}

// Detalle de un personaje. next.revalidate -> se regenera cada 10 días (ISR).
// Devuelve null si el personaje no existe (404).
export async function getCharacter(id: string): Promise<Character | null> {
  const res = await apiFetch(`${API_URL}/character/${id}`, {
    next: { revalidate: TEN_DAYS },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al cargar el personaje");

  return res.json();
}

// Extrae el número de episodio de su URL: ".../episode/28" -> 28
export function getEpisodeNumber(url: string): number {
  return Number(url.split("/").pop());
}

// Trae todos los episodios de un personaje en UNA sola petición: /episode/1,2,3
export async function getEpisodes(urls: string[]): Promise<Episode[]> {
  if (urls.length === 0) return [];

  const ids = urls.map(getEpisodeNumber).join(",");

  try {
    const res = await apiFetch(`${API_URL}/episode/${ids}`, {
      next: { revalidate: TEN_DAYS },
    });
    if (!res.ok) return [];

    const data: Episode | Episode[] = await res.json();
    return Array.isArray(data) ? data : [data]; // con un solo id la API devuelve un objeto
  } catch {
    return []; // si falla, la página muestra solo los números de episodio
  }
}

export const statusStyles: Record<string, { dot: string; pill: string; label: string }> = {
  Alive: {
    dot: "bg-emerald-400",
    pill: "bg-emerald-400/15 text-emerald-300 border-emerald-400/40",
    label: "Vivo",
  },
  Dead: {
    dot: "bg-red-500",
    pill: "bg-red-500/15 text-red-300 border-red-500/40",
    label: "Muerto",
  },
  unknown: {
    dot: "bg-gray-400",
    pill: "bg-gray-400/15 text-gray-300 border-gray-400/40",
    label: "Desconocido",
  },
};

export const genderLabels: Record<string, string> = {
  Female: "Femenino",
  Male: "Masculino",
  Genderless: "Sin género",
  unknown: "Desconocido",
};

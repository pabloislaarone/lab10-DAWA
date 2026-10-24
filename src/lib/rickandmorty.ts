import { Character, CharacterListResponse, Episode } from "@/types/character";

export const API_URL = "https://rickandmortyapi.com/api";

// 10 días en segundos (60 * 60 * 24 * 10)
export const TEN_DAYS = 864000;

// Cantidad de personajes que se piden juntos en una sola petición: /character/1,2,3,...
const BATCH_SIZE = 100;

// Durante el build se guardan en memoria las peticiones en curso, para que varias páginas
// que necesitan el mismo bloque no lo pidan a la vez (en producción manda la caché de Next).
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const buildMemo = new Map<string, Promise<unknown>>();

function memoDuringBuild<T>(key: string, loader: () => Promise<T>): Promise<T> {
  if (!isBuild) return loader();
  if (!buildMemo.has(key)) buildMemo.set(key, loader());
  return buildMemo.get(key) as Promise<T>;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch con reintentos: si la API responde 429 (demasiadas peticiones) o un error 5xx,
// espera un poco más en cada intento y vuelve a probar. Útil en el build de Vercel.
// Cada reintento lleva un header distinto para que Next no reutilice la respuesta fallida.
async function apiFetch(url: string, init: RequestInit, retries = 6): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const options: RequestInit =
      attempt === 0 ? init : { ...init, headers: { "x-retry-attempt": String(attempt) } };
    try {
      const res = await fetch(url, options);
      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= retries) return res;
    } catch (err) {
      if (attempt >= retries) throw err;
    }
    await wait(1500 * (attempt + 1));
  }
}

// Lista completa de personajes para la página principal.
// cache: "force-cache" -> la respuesta se guarda en caché y se reutiliza (SSG).
export async function getAllCharacters(): Promise<Character[]> {
  const firstRes = await apiFetch(`${API_URL}/character`, { cache: "force-cache" });
  if (!firstRes.ok) throw new Error("Error al cargar los personajes");

  const firstPage: CharacterListResponse = await firstRes.json();
  const characters = [...firstPage.results];

  // La API devuelve 20 personajes por página; pedimos el resto una por una
  // (en orden, para no saturar la API con muchas peticiones al mismo tiempo)
  for (let page = 2; page <= firstPage.info.pages; page++) {
    const res = await apiFetch(`${API_URL}/character?page=${page}`, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Error al cargar la página ${page}`);

    const data: CharacterListResponse = await res.json();
    characters.push(...data.results);
  }

  return characters;
}

// Total de personajes: se usa para generar las rutas estáticas
export async function getCharactersCount(): Promise<number> {
  return memoDuringBuild("count", loadCharactersCount);
}

async function loadCharactersCount(): Promise<number> {
  const res = await apiFetch(`${API_URL}/character`, { cache: "force-cache" });
  if (!res.ok) throw new Error("Error al obtener el total de personajes");

  const data: CharacterListResponse = await res.json();
  return data.info.count;
}

// Detalle de un personaje. next.revalidate -> se regenera cada 10 días (ISR).
// En vez de pedir /character/{id} para cada página (cientos de peticiones en el build),
// se pide el bloque de 100 personajes al que pertenece: /character/1,2,...,100.
// Todas las páginas de ese bloque reutilizan la misma respuesta en caché.
export async function getCharacter(id: string): Promise<Character | null> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return null;

  const start = Math.floor((numericId - 1) / BATCH_SIZE) * BATCH_SIZE + 1;
  const ids = Array.from({ length: BATCH_SIZE }, (_, i) => start + i).join(",");

  const batch = await memoDuringBuild(`characters-${start}`, async () => {
    const res = await apiFetch(`${API_URL}/character/${ids}`, {
      next: { revalidate: TEN_DAYS },
    });
    if (!res.ok) throw new Error("Error al cargar el personaje");

    const data: Character | Character[] = await res.json();
    return Array.isArray(data) ? data : [data];
  });

  return batch.find((character) => character.id === numericId) ?? null;
}

// Extrae el número de episodio de su URL: ".../episode/28" -> 28
export function getEpisodeNumber(url: string): number {
  return Number(url.split("/").pop());
}

// Todos los episodios de la serie (son pocas páginas), revalidados cada 10 días (ISR)
async function getAllEpisodes(): Promise<Episode[]> {
  return memoDuringBuild("episodes", loadAllEpisodes);
}

async function loadAllEpisodes(): Promise<Episode[]> {
  const episodes: Episode[] = [];
  let url: string | null = `${API_URL}/episode`;

  while (url) {
    const res = await apiFetch(url, { next: { revalidate: TEN_DAYS } });
    if (!res.ok) throw new Error("Error al cargar los episodios");

    const data: { info: { next: string | null }; results: Episode[] } = await res.json();
    episodes.push(...data.results);
    url = data.info.next;
  }

  return episodes;
}

// Episodios de un personaje: se buscan dentro de la lista completa (ya en caché)
export async function getEpisodes(urls: string[]): Promise<Episode[]> {
  if (urls.length === 0) return [];

  try {
    const ids = new Set(urls.map(getEpisodeNumber));
    const all = await getAllEpisodes();
    return all.filter((episode) => ids.has(episode.id));
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

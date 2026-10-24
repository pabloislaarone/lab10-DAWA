export type CharacterStatus = "Alive" | "Dead" | "unknown";

export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

export interface CharacterPlace {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterPlace;
  location: CharacterPlace;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // código, ej: "S01E01"
  characters: string[];
  url: string;
  created: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface CharacterListResponse {
  info: ApiInfo;
  results: Character[];
}

export interface CharacterFilters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

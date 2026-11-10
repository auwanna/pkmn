export type GraphQLRequest<T = unknown> = {
  data: T;
};

export type SpriteOptions = {
  id: PokeAPIPokemon["id"];
  style: "showdown" | "official" | "default";
  shiny?: boolean;
};

export type PokeAPIPokemon = {
  id: number;
  name: string;
  slug: string;
  types: string[];
};

export type PokeAPIRegion = {
  name: string;
  region: string;
  total: { species: number };
};

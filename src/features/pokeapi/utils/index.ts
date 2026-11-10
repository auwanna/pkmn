import type { SpriteOptions } from "@/features/pokeapi/types";

export function getSprite({ id, style, shiny }: SpriteOptions) {
  switch (style) {
    case "official": {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shiny ? "shiny/" : ""}${id}.png`;
    }
    case "showdown": {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${shiny ? "shiny/" : ""}${id}.gif`;
    }
    default: {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shiny ? "shiny/" : ""}${id}.png`;
    }
  }
}

export async function getPokemon(id: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  const data = await response.json();
  if (!response.ok) throw response;
  return data;
}

export async function getSpecies(id: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  const data = await response.json();
  if (!response.ok) throw response;
  return data;
}

export function getPokemonCryOgg(id: string, type: "latest" | "legacy") {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/${type}/${id}.ogg`;
}

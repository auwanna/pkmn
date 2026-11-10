import {
  array,
  fallback,
  type InferOutput,
  number,
  object,
  picklist,
  pipe,
  string,
  transform,
} from "valibot";
import { pokedex } from "@/features/pokeapi/data/pokedex";

export const SpriteStyleSchema = fallback(
  picklist(["default", "official", "showdown"]),
  "default",
);

export const PokemonSchema = object({
  species: pipe(
    array(
      object({
        generation: object({
          id: number(),
          region: object({
            name: string(),
          }),
        }),
        id: number(),
        name: string(),
        pokemons: array(
          object({
            types: array(object({ type: object({ name: string() }) })),
          }),
        ),
      }),
    ),
    transform((input) => {
      return input.map((i) => {
        const mon = pokedex.find((y) => y.id === i.id);
        if (!mon) throw new Error(`no pokemon found: ${i.id}`);

        return {
          generation: i.generation.id,
          id: i.id,
          name: mon.name ?? "<TODO>",
          region: i.generation.region.name,
          slug: i.name,
          types: i.pokemons.flatMap((x) => x.types.map((x) => x.type.name)),
        };
      });
    }),
  ),
});

export const RegionSchema = object({
  generations: pipe(
    array(
      object({
        name: string(),
        region: object({ name: string() }),
        species: object({ total: object({ count: number() }) }),
      }),
    ),
    transform((input) =>
      input.map((x) => ({
        name: x.name,
        region: x.region.name,
        total: { count: x.species.total.count },
      })),
    ),
  ),
});

export type PokeAPIRegion = InferOutput<typeof RegionSchema>;
export type PokeAPIPokemon = InferOutput<typeof PokemonSchema>;

export type SpriteStyle = InferOutput<typeof SpriteStyleSchema>;

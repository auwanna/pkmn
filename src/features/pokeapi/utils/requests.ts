import { safeParse } from "valibot";
import { PokemonSchema, RegionSchema } from "@/features/pokeapi/schemas";
import type { GraphQLRequest } from "@/features/pokeapi/types";
import { remove, stringify, write } from "@/lib/nodejs";

export async function fetchGraphQL<T>(query: string, variables: T | null, operationName: string) {
  const response = await fetch("https://graphql.pokeapi.co/v1beta2", {
    body: JSON.stringify({
      operationName: operationName,
      query: query,
      variables: variables,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok || response.status !== 200) {
    throw response;
  }

  return await response.json();
}

export const getRegions = async () => {
  const query = `
    query getRegions {
      generations: generation {
        name
        region {
          name
        }
        species: pokemonspecies_aggregate {
          total: aggregate {
            count
          }
        }
      }
    }
  `;

  const data: GraphQLRequest = await fetchGraphQL(query, null, "getRegions");
  const validated = safeParse(RegionSchema, data.data);

  if (validated.success) {
    await write("./src/features/pokeapi/data/regions.json", stringify(validated.output));
    await remove("./src/features/pokeapi/issues/regions.json");
  } else {
    await write(
      "./src/features/pokeapi/issues/regions.json",
      stringify({
        issues: validated.issues,
        output: validated.output,
      }),
    );
  }
};

export const getMons = async () => {
  const query = `
    query getMons {
      species: pokemonspecies(
        order_by: {id: asc}
      ) {
        name
        id
        generation {
          id
          region {
            name
          }
        }
        pokemons(limit: 1) {
          name
          types: pokemontypes {
            type {
              name
            }
          }
        }
      }
    }
  `;

  const data: GraphQLRequest = await fetchGraphQL(query, null, "getMons");

  const validated = safeParse(PokemonSchema, data.data);

  if (validated.success) {
    await write(
      "./src/features/pokeapi/data/pokedex.ts",
      `export const pokedex = ${JSON.stringify(validated.output.species, null, 2)} as const`,
    );
    await remove("./src/features/pokeapi/issues/pokedex.json");
  } else {
    await write(
      "./src/features/pokeapi/issues/pokedex.json",
      stringify({
        issues: validated.issues,
        output: validated.output,
      }),
    );
  }
};

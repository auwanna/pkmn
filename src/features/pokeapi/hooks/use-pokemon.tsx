import { useQuery } from "@tanstack/react-query";
import { getPokemon } from "@/features/pokeapi/utils";

export const keys = {
  pokemon: (id: string) => [keys.prefix, id] as const,
  prefix: "pokeapi" as const,
};

export function usePokeAPIPokemon(key: string) {
  return useQuery({
    queryFn: async ({ queryKey: [_, id] }) => {
      return await getPokemon(id);
    },
    queryKey: keys.pokemon(key),
  });
}

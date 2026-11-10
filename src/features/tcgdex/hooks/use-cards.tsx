import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { tcgDexQueryKeys } from "@/features/tcgdex/lib/react-query-keys";
import { getCards } from "@/features/tcgdex/lib/requests";
import type { SearchRouteSchemaOutput } from "@/features/tcgdex/schemas/search";
import type { TODO } from "@/types";

export type UseCardsParams = Partial<SearchRouteSchemaOutput>;

export function useCards(args: UseCardsParams = {}) {
  const searchParams = useSearch({ strict: false });
  const params = { ...args, ...searchParams };

  return useQuery({
    queryFn: async ({ queryKey: [, , params] }) => {
      const data = await getCards(params as TODO);
      return { data };
    },
    queryKey: tcgDexQueryKeys.cards(params),
  });
}

export function useCardsMeta(args: UseCardsParams = {}) {
  const searchParams = useSearch({ strict: false });

  const params = {
    ...args,
    ...searchParams,
    limit: undefined,
    order: undefined,
    page: undefined,
    sort: undefined,
  };

  const { data, status } = useQuery({
    queryFn: async ({ queryKey: [, , params] }) => {
      const data = await getCards(params as TODO);
      return data.length;
    },
    queryKey: tcgDexQueryKeys.cardsTotal(params),
  });

  const totalItems = data || 0;
  const maxPages = Math.ceil(totalItems / (searchParams.limit || 20));

  return {
    currentPage: searchParams.page,
    maxPages,
    status,
    totalItems,
  };
}

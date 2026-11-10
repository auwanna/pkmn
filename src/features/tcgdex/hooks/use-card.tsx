import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { tcgDexQueryKeys } from "@/features/tcgdex/lib/react-query-keys";
import { getCard } from "@/features/tcgdex/lib/requests";

export function useCard() {
  const params = useParams({ from: "/cards/$cardId/" });

  return useQuery({
    queryKey: tcgDexQueryKeys.card(params.cardId),
    queryFn: async ({ queryKey: [, , cardId] }) => {
      const response = await getCard(cardId);

      return {
        ...response,
        cardmarket: {
          prices: response.pricing?.cardmarket,
          updatedAt: response.pricing.cardmarket?.updated,
        },
        tcgplayer: {
          prices: response.pricing.tcgplayer,
          updatedAt: response.pricing.tcgplayer?.updated,
        },
      };
    },
  });
}

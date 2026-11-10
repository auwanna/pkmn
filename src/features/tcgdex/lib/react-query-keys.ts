export const tcgDexQueryKeys = {
  prefix: "tcgdex" as const,

  card: (cardId: string) => [tcgDexQueryKeys.prefix, "card", cardId] as const,

  cards: <T>(params: T) => [tcgDexQueryKeys.prefix, "cards", params] as const,
  cardsTotal: <T>(params: T) =>
    [tcgDexQueryKeys.prefix, "cards-total", params] as const,

  expansions: <T>(params: T) =>
    [tcgDexQueryKeys.prefix, "expansions", params] as const,
  expansionsTotal: <T>(params: T) =>
    [tcgDexQueryKeys.prefix, "expansions-total", params] as const,

  illustrators: () => [tcgDexQueryKeys.prefix, "illustrators"] as const,
};

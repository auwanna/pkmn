import type {
  APITCGdexCardmarketPricing,
  APITCGdexPokemonCard,
  APITCGdexTCGPlayerPricing,
} from "./api";

export type PokemonCard = Omit<APITCGdexPokemonCard, "pricing"> & {
  pricing: {
    tcgplayer: {
      prices: TCGPrice[];
      updated: APITCGdexTCGPlayerPricing["updated"];
      unit: APITCGdexTCGPlayerPricing["unit"];
    } | null;
    cardmarket: {
      prices: CardmarketPrice[];
      updated: APITCGdexCardmarketPricing["updated"];
      productId: APITCGdexCardmarketPricing["idProduct"];
      unit: APITCGdexCardmarketPricing["unit"];
    } | null;
  };
};

export type TCGPrice = {
  label: string;
  prices: {
    label: string;
    value: string;
  }[];
};

export type CardmarketPriceEntry = {
  label: string;
  value: string;
};

export type CardmarketPrice = {
  label: string;
  prices: CardmarketPriceEntry[];
};

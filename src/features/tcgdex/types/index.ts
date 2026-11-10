export type APITCGdexSerie = {
  id: string;
  name: string;
  logo: string | null;
  sets: APITCGdexSetBrief[];
};

export type APITCGdexSerieBrief = {
  id: string;
  name: string;
};

type APITCGdexSetLegality = {
  standard: boolean;
  expanded: boolean;
};

type APITCGdexSetCardCount = {
  total: number;
  official: number;
  reverse: number;
  normal: number;
  holo: number;
  firstEd: number;
};

export type APITCGdexSet = {
  id: string;
  name: string;
  logo: string | null;
  symbol: string | null;
  cardCount: APITCGdexSetCardCount;
  serie: APITCGdexSerieBrief;
  tcgOnline: string | null;
  releaseDate: string;
  legal: APITCGdexSetLegality;
  boosters: TCGdexBooster[];
  cards: APITCGdexCardBrief[];
};

type APITCGdexSetBriefCardCount = {
  total: number;
  official: number;
};

export type APITCGdexSetBrief = {
  id: string;
  name: string;
  logo: string | null;
  symbol: string | null;
  cardCount: APITCGdexSetBriefCardCount;
};

export type APITCGdexCardBrief = {
  id: string;
  localId: string | number;
  name: string;
  image: string | number;
};

export type APITCGdexVariant = {
  normal: boolean;
  reverse: boolean;
  holo: boolean;
  firstEdition: boolean;
};

export type APITCGdexCard = {
  id: string;
  localId: string;
  name: string;
  image: string;
  category: string;
  illustrator: string | null;
  rarity: string | null;
  regulationMark: string | null;
  variants: APITCGdexVariant;
  boosters: TCGdexBooster[] | null;
  set: APITCGdexSetBrief;
  pricing: TCGdexPricing;
};

export type APITCGdexPokemonItem = {
  name: string;
  effect: string;
};

export type APITCGdexPokemonCard = APITCGdexCard & {
  abilities: TCGdexAbility[] | null;
  attacks: TCGdexAttack[] | null;
  category: string;
  description: string | null;
  dexId: number[] | null;
  effect: string | null;
  energyType: string | null;
  evolveFrom: string | null;
  hp: number | null;
  id: string;
  illustrator: string | null;
  image: string | null;
  item: TCGdexItem | null;
  legal: TCGdexLegal;
  level: number | null;
  name: string;
  rarity: string;
  regulationMark: string | null;
  resistances: TCGdexWeakRes[] | null;
  retreat: number | null;
  set: TCGdexCardSet;
  stage: string | null;
  suffix: string | null;
  trainerType: string | null;
  types: string[] | null;
  boosters: TCGdexBooster[] | null;
  weaknesses: TCGdexWeakRes[] | null;
};

export type APITCGdexTrainerCard = APITCGdexCard & {
  category: "Trainer";
  effect: string;
  trainerType: string;
};

export type APITCGdexEnergyCard = APITCGdexCard & {
  category: "Energy";
  effect: string;
  energyType: string;
};

export type GraphlqlSets = {
  sets: {
    id: string;
    name: string;
    logo: string | null;
    symbol: string | null;
    releaseDate: string;
    serie: {
      name: string;
      logo: string | null;
    };
    cardCount: {
      total: string;
      official: string;
    };
  }[];
};

type TCGdexAbility = {
  effect: string | null;
  name: string | null;
  type: string | null;
};

type TCGdexAttack = {
  cost: string[] | null;
  damage: string | null;
  effect: string | null;
  name: string;
};

type TCGdexItem = {
  name: string;
  effect: string;
};

type TCGdexLegal = {
  expanded: boolean | null;
  standard: boolean | null;
};

type TCGdexWeakRes = {
  type: string;
  value: string | null;
};

type TCGdexCardSet = {
  id: string;
  logo: string | null;
  name: string;
  symbol: string | null;
};

type TCGdexBooster = {
  id: string;
  name: string;
  logo: string | null;
  artwork_front: string | null;
  artwork_back: string | null;
};

type TCGdexPricing = {
  cardmarket: APITCGdexCardmarketPricing | null;
  tcgplayer: APITCGdexTCGPlayerPricing | null;
};

export type APITCGdexCardmarketPricing = {
  updated: string;
  unit: "EUR";
  avg?: number;
  low?: number;
  trend?: number;
  avg1?: number;
  avg7?: number;
  avg30?: number;
  "avg-holo"?: number;
  "low-holo"?: number;
  "trend-holo"?: number;
  "avg1-holo"?: number;
  "avg7-holo"?: number;
  "avg30-holo"?: number;
};

export type APITCGdexTCGPlayerPricing = {
  updated: string;
  unit: "USD";
  normal?: TCGPlayerPriceVariant;
  holofoil?: TCGPlayerPriceVariant;
  "reverse-holofoil"?: TCGPlayerPriceVariant;
  "1st-edition"?: TCGPlayerPriceVariant;
  "1st-edition-holofoil"?: TCGPlayerPriceVariant;
  unlimited?: TCGPlayerPriceVariant;
  "unlimited-holofoil"?: TCGPlayerPriceVariant;
};

type TCGPlayerPriceVariant = {
  lowPrice?: number;
  midPrice?: number;
  highPrice?: number;
  marketPrice?: number;
  directLowPrice?: number;
};

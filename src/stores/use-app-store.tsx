import { create } from "zustand";
import type { SpriteOptions } from "@/features/pokeapi/types";

type State = {
  columns: number;
  isShiny: boolean;
  spriteType: SpriteOptions["style"];
  expansionQuery: string;
  pokedexQuery: string;
};

type Action = {
  setColumns: (value: State["columns"]) => void;
  setIsShiny: (value: State["isShiny"]) => void;
  setSpriteType: (value: State["spriteType"]) => void;
  setExpansionQuery: (value: State["expansionQuery"]) => void;
  setPokedexQuery: (value: State["pokedexQuery"]) => void;
};

const defaultStore: State = {
  columns: 1,
  expansionQuery: "",
  isShiny: false,
  pokedexQuery: "",
  spriteType: "default",
};

export const useAppStore = create<State & Action>((set) => ({
  ...defaultStore,
  setColumns: (value) => set(() => ({ columns: value })),
  setExpansionQuery: (value) => set(() => ({ expansionQuery: value })),
  setIsShiny: (value) => set(() => ({ isShiny: value })),
  setPokedexQuery: (value) => set(() => ({ pokedexQuery: value })),
  setSpriteType: (value) => set(() => ({ spriteType: value })),
}));

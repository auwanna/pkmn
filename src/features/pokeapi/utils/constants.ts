export const TOTAL_POKEMON = 1025;

export const generations = [
  "Kanto",
  "Johto",
  "Hoenn",
  "Sinnoh",
  "Unova",
  "Kalos",
  "Alola",
  "Galar",
  "Hisuian",
  "Paldea",
] as const;

export type Generation = (typeof generations)[number];

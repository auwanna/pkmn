import {
  fallback,
  type InferInput,
  type InferOutput,
  maxValue,
  minValue,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  union,
} from "valibot";
import { pokedex } from "@/features/pokeapi/data/pokedex";
import { ITEMS_PER_PAGE, ORDER, SORT } from "../lib/constants";

export const LimitSchema = object({
  limit: fallback(
    pipe(
      union([string(), number()]),
      transform((input) => (typeof input === "string" ? Number(input) : input)),
      picklist(ITEMS_PER_PAGE.map((x) => x.value)),
    ),
    20,
  ),
});

export const OrderSchema = object({
  order: fallback(picklist(ORDER.map((o) => o.value)), "asc"),
});

export const PageSchema = object({
  page: fallback(
    pipe(
      union([string(), number()]),
      transform((input) => (typeof input === "string" ? Number(input) : input)),
      minValue(1),
    ),
    1,
  ),
});

export const SortSchema = object({
  sort: fallback(picklist(SORT.map((s) => s.value)), "name"),
});

export const PokedexSearchSchema = object({
  ...LimitSchema.entries,
  ...SortSchema.entries,
  ...OrderSchema.entries,
  ...PageSchema.entries,
});

export const SetIdRouteSchema = object({
  ...LimitSchema.entries,
  ...SortSchema.entries,
  ...OrderSchema.entries,
  ...PageSchema.entries,
});

export const SearchFormSchema = object({
  categories: optional(string()),
  energies: optional(string()),
  hp: optional(number()),
  pokedex: optional(pipe(number(), minValue(1), maxValue(pokedex.length))),
  illustrators: optional(string()),
  marks: optional(string()),
  name: optional(string()),
  rarities: optional(string()),
  stages: optional(string()),
  expansions: optional(string()),
  suffixes: optional(string()),
});

export const SearchRouteSchema = object({
  ...SearchFormSchema.entries,
  ...LimitSchema.entries,
  ...SortSchema.entries,
  ...OrderSchema.entries,
  ...PageSchema.entries,
});

export type SearchRouteSchemaInput = InferInput<typeof SearchRouteSchema>;
export type SearchRouteSchemaOutput = InferOutput<typeof SearchRouteSchema>;

export type LimitSchemaInput = InferInput<typeof LimitSchema>;
export type LimitSchemaOutput = InferOutput<typeof LimitSchema>;

export type SortSchemaInput = InferInput<typeof SortSchema>;
export type SortSchemaOutput = InferOutput<typeof SortSchema>;

export type OrderSchemaInput = InferInput<typeof OrderSchema>;
export type OrderSchemaOutput = InferOutput<typeof OrderSchema>;

export type SetIdRouteInput = InferInput<typeof SetIdRouteSchema>;
export type SetIdRouteOutput = InferOutput<typeof SetIdRouteSchema>;

export type PokedexSearchInput = InferInput<typeof PokedexSearchSchema>;
export type PokedexSearchOutput = InferOutput<typeof PokedexSearchSchema>;

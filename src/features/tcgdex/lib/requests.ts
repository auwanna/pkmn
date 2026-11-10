import type { SearchRouteSchemaOutput } from "@/features/tcgdex/schemas/search";
import type {
  APITCGdexCardBrief,
  APITCGdexPokemonCard,
  APITCGdexSerie,
  APITCGdexSerieBrief,
  APITCGdexSet,
  GraphlqlSets,
} from "@/features/tcgdex/types";

export const TCGDEX_API = "https://api.tcgdex.net/v2/";

export async function request<T>(
  ...[input, init]: Parameters<typeof fetch>
): Promise<T> {
  console.time(input.toString());
  const response = await fetch(input, {
    ...init,
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok || response.status !== 200) {
    throw response;
  }
  console.timeEnd(input.toString());
  return response.json();
}

export function getEndpoint(endpoint: string) {
  return new URL(`en/${endpoint}`, TCGDEX_API);
}

export async function getCard(cardId: string) {
  const url = new URL(`https://api.tcgdex.net/v2/en/cards/${cardId}`);
  return await request<APITCGdexPokemonCard>(url.href);
}

const tcgDexKeyTable: Record<keyof SearchRouteSchemaOutput, string> = {
  illustrators: "illustrator",
  limit: "pagination:itemsPerPage",
  name: "name",
  order: "sort:order",
  page: "pagination:page",
  pokedex: "dexId",
  expansions: "set.id",
  categories: "category",
  hp: "hp",
  marks: "regulationMark",
  suffixes: "suffix",
  stages: "stage",
  rarities: "rarity",
  sort: "sort:field",
  energies: "types",
};

export async function getCards(params: SearchRouteSchemaOutput) {
  const url = new URL(`https://api.tcgdex.net/v2/en/cards`);

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (!(key in tcgDexKeyTable) || !value) continue;

    if (key === "expansions") {
      query.set("set.id", `eq:${value}`);
      continue;
    }

    query.set(
      tcgDexKeyTable[key as keyof typeof tcgDexKeyTable],
      key === "order" ? value.toString().toUpperCase() : value.toString(),
    );
  }

  return await request<APITCGdexCardBrief[]>(`${url.href}?${query.toString()}`);
}

export async function getSet(id: string) {
  const url = getEndpoint(`sets/${id}`);
  return await request<APITCGdexSet>(url.href);
}

export async function getSets(lang = "en") {
  const url = new URL("https://api.tcgdex.net/v2/graphql");

  return await request<{ data: GraphlqlSets }>(url.href, {
    body: JSON.stringify({
      query: `query GetSets ($lang: String = "en") {
        sets @locale(lang: $lang) {
            id,
            name,
            logo,
            symbol,
            releaseDate,
            serie {
              name,
              logo
            },
            cardCount {
              total
              official
            }
        }
      }`,
      variables: {
        lang,
      },
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

export async function getSerie(id: string) {
  const url = getEndpoint(`series/${id}`);
  return await request<APITCGdexSerie>(url.href);
}

export async function getSeries(searchParams: string) {
  const url = getEndpoint(`sets${searchParams ? `?${searchParams}` : ""}`);
  return await request<APITCGdexSerieBrief[]>(url.href);
}

export async function getTypes() {
  const url = getEndpoint(`types`);
  return await request<string[]>(url.href);
}

export async function getRarities() {
  const url = getEndpoint(`rarities`);
  return await request<string[]>(url.href);
}

export async function getIllustrators() {
  const url = getEndpoint(`illustrators`);
  return await request<string[]>(url.href);
}

export async function getCategories() {
  const url = getEndpoint(`categories`);
  return await request<string[]>(url.href);
}

export async function getEnergyTypes() {
  const url = getEndpoint(`energytypes`);
  return await request<string[]>(url.href);
}

export async function getRegulationMarks() {
  const url = getEndpoint(`regulationmarks`);
  return await request<string[]>(url.href);
}

export async function getStages() {
  const url = getEndpoint(`stages`);
  return await request<string[]>(url.href);
}

export async function getTrainerTypes() {
  const url = getEndpoint(`trainertypes`);
  return await request<string[]>(url.href);
}

export async function getVariants() {
  const url = getEndpoint(`variants`);
  return await request<string[]>(url.href);
}

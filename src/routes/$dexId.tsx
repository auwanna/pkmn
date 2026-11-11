import { IconCards } from "@tabler/icons-react";
import { createFileRoute, redirect, useLoaderData } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";

import { Link } from "@/components/link";
import { Pagination, PaginationContent, PaginationItem } from "@/components/pagination";
import { pokedex } from "@/features/pokeapi/data/pokedex";
import { getSprite } from "@/features/pokeapi/utils";
import {
  CurrentPage,
  FirstPage,
  GridItems,
  GridItemsTotal,
  LastPage,
  NextPage,
  PreviousPage,
} from "@/features/tcgdex/components/grid-cards";
import { SelectItemsPerPage, SelectSort } from "@/features/tcgdex/components/select-display";
import { PokedexSearchSchema } from "@/features/tcgdex/schemas/search";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/$dexId")({
  component: RouteComponent,
  loader: ({ params }) => {
    const currentIdx = pokedex.findIndex((poke) => {
      return poke.id.toString() === params.dexId || poke.slug === params.dexId;
    });

    const nextIdx = (currentIdx + 1) % pokedex.length;
    const prevIdx = (currentIdx - 1 + pokedex.length) % pokedex.length;

    if (!pokedex[currentIdx] || !pokedex[nextIdx] || !pokedex[prevIdx]) {
      throw redirect({
        to: "/",
      });
    }

    return {
      currentPokemon: pokedex[currentIdx],
      nextPokemon: pokedex[nextIdx],
      previousPokemon: pokedex[prevIdx],
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const current = loaderData.currentPokemon;

    const pokedexNumber = current.id.toString().padStart(4, "0");
    const description = `Explore all Pokémon TCG cards featuring ${current.name} (#${pokedexNumber}).`;

    const title = `${current.name} (#${pokedexNumber})`;
    const imageUrl = getSprite({ id: current.id, style: "default" });

    return {
      links: [{ rel: "canonical", href: `/${current.slug}` }],
      meta: seo({
        title,
        description,
        keywords: [current.name, "pokemon", "pokemon trading cards", "tcg"],
        openGraph: {
          alt: `${current.name} sprite`,
          height: 128,
          width: 192,
          src: imageUrl,
        },
        twitter: {
          alt: `${current.name} sprite`,
          height: 128,
          width: 192,
          src: imageUrl,
        },
      }),
    };
  },
  staleTime: Number.POSITIVE_INFINITY,
  validateSearch: PokedexSearchSchema,
});

function RouteComponent() {
  const { currentPokemon, nextPokemon } = useLoaderData({
    from: "/$dexId",
  });

  const initialParams = {
    name: currentPokemon.name,
  };

  return (
    <main className="flex grow flex-col">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink render={<Link to="/" />}>Pokédex</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <h1>{currentPokemon.name}</h1>
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />

            <BreadcrumbItem>
              <BreadcrumbLink
                render={
                  <Link
                    params={{ dexId: nextPokemon.slug }}
                    search={(prev) => ({ ...prev, page: 1 })}
                    to="."
                  />
                }
              >
                {nextPokemon.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 border-t bg-background px-5 py-4 sm:border-0 sm:border-t-0 sm:border-b">
        <div className="flex items-center gap-2 text-xl">
          <IconCards className="size-6 text-primary" />
          <span className="font-semibold">
            <GridItemsTotal initialParams={initialParams} />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-3 py-2">
        <SelectItemsPerPage />
        <SelectSort />
      </div>

      <div className="flex grow flex-col">
        <ul className="grid grid-cols-fill gap-2 px-3">
          <GridItems initialParams={initialParams} />
        </ul>
        <div className="mt-4 mb-4">
          <Pagination>
            <PaginationContent className="gap-0 rounded-xs border p-1">
              <PaginationItem className="size-8 **:[svg]:size-5">
                <FirstPage initialParams={initialParams} />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <PreviousPage initialParams={initialParams} />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <CurrentPage initialParams={initialParams} />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <NextPage initialParams={initialParams} />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <LastPage initialParams={initialParams} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}

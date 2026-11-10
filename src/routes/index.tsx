import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/breadcrumb";
import { ToggleArtworkGroup, ToggleShiny } from "@/features/pokeapi/components/artwork-controls";
import { InputPokedex } from "@/features/pokeapi/components/input-pokedex";
import { VirtualizerPokedex } from "@/features/pokeapi/components/virtualizer-dex";
import { pokedex } from "@/features/pokeapi/data/pokedex";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  head: () => ({
    meta: seo({
      keywords: ["pokemon", "pokedex", "search"],
      title: "Pokédex",
    }),
  }),
});

function RouteComponent() {
  return (
    <main className="flex grow flex-col">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Pokédex</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <h1>
        {`Search `}
        <span className="text-primary">{pokedex.length}</span>
        {` Pokémon`}
      </h1>

      <div className="inline-flex items-center gap-2 px-3 py-2">
        <ToggleArtworkGroup />
        <ToggleShiny />
      </div>
      <div className="sticky top-0 z-10 mx-auto flex w-full flex-wrap items-center border-b bg-background">
        <InputPokedex />
      </div>

      <VirtualizerPokedex />
    </main>
  );
}

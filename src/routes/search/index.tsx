import { IconCards } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/breadcrumb";
import { Grid, GridList } from "@/components/grid";
import { Pagination, PaginationContent, PaginationItem } from "@/components/pagination";
import {
  FirstPage,
  GridItems,
  GridItemsTotal,
  LastPage,
  NextPage,
  PreviousPage,
} from "@/features/tcgdex/components/grid-cards";
import { SelectItemsPerPage, SelectSort } from "@/features/tcgdex/components/select-display";
import { SheetSearch } from "@/features/tcgdex/components/sheet-search";
import { SearchRouteSchema } from "@/features/tcgdex/schemas/search";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/search/")({
  component: RouteComponent,
  staleTime: Number.POSITIVE_INFINITY,
  validateSearch: SearchRouteSchema,
  head: () => ({
    links: [{ rel: "canonical", href: "/search" }],
    meta: seo({
      description: "Search for Pokémon cards by name, artist, and more",
      keywords: [
        "pokemon card search",
        "find pokemon cards",
        "card database",
        "pokemon tcg database",
        "pokemon trading cards",
      ],
      title: "Search",
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
              <BreadcrumbPage>Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 border-t bg-background px-5 py-4 sm:border-0 sm:border-t-0 sm:border-b">
        <div className="flex items-center gap-2 text-xl">
          <IconCards className="size-6 text-primary" />
          <span className="font-semibold">
            <GridItemsTotal />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2 px-3 py-2">
        <SelectItemsPerPage />
        <SelectSort />
        <SheetSearch />
      </div>

      <div className="flex grow flex-col">
        <ul className="grid grid-cols-fill gap-2 px-3">
          <GridItems />
        </ul>
        <div className="mt-4 mb-4">
          <Pagination>
            <PaginationContent className="gap-2 rounded-lg border border-t-4 px-3 py-1">
              <PaginationItem className="size-8 **:[svg]:size-5">
                <FirstPage />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <PreviousPage />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <NextPage />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <LastPage />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}

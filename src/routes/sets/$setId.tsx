import { IconCards } from "@tabler/icons-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Grid, GridList } from "@/components/grid";
import { Link } from "@/components/link";
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
import { tcgDexQueryKeys } from "@/features/tcgdex/lib/react-query-keys";
import { getSet } from "@/features/tcgdex/lib/requests";
import { type SearchRouteSchemaOutput, SetIdRouteSchema } from "@/features/tcgdex/schemas/search";
import { seo } from "@/lib/seo";

const expansionQueryOptions = (id: string) =>
  queryOptions({
    queryFn: async ({ queryKey: [, , params] }) => {
      const { name, id, serie, logo, releaseDate } = await getSet(params.id);
      return { name, id, serie, logo, releaseDate };
    },
    queryKey: tcgDexQueryKeys.expansions({ id }),
  });

export const Route = createFileRoute("/sets/$setId")({
  component: RouteComponent,
  validateSearch: SetIdRouteSchema,
  loader: async ({ context, params }) => {
    return context.queryClient.query({
      ...expansionQueryOptions(params.setId),
      staleTime: "static",
    });
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};

    const expansion = loaderData;

    const keywords = [
      expansion.name,
      expansion.serie.name,
      "pokemon",
      "pokemon trading card expansions",
      "pokemon trading card sets",
      "pokemon trading card series",
    ];

    const description = `${expansion.name} from ${expansion.serie.name} released on ${expansion.releaseDate}.`;

    return {
      links: [{ href: `/sets/${loaderData.id}`, rel: "canonical" }],
      meta: seo({
        description,
        keywords,
        title: `${expansion.serie.name} | ${expansion.name}`,
        ...(expansion.logo && {
          openGraph: {
            src: `${expansion.logo}.webp`,
            alt: `${expansion.name} logo`,
            height: 128,
            width: 192,
          },
          twitter: {
            src: `${expansion.logo}.webp`,
            alt: `${expansion.name} logo`,
            height: 128,
            width: 192,
          },
        }),
      }),
    };
  },
});

function RouteComponent() {
  const params = useParams({ from: "/sets/$setId" });
  const { data: expansion } = useSuspenseQuery(expansionQueryOptions(params.setId));

  const initialParams: Partial<SearchRouteSchemaOutput> = {
    expansions: params.setId,
  };

  return (
    <main className="flex grow flex-col">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink render={<Link to="/sets" />}>Sets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{expansion.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <h1 className="sticky top-0 z-10 flex h-16 items-center justify-center border-b bg-background px-3 py-3 font-bold font-display text-4xl">
        <span className="truncate">{expansion.name}</span>
      </h1>

      <div className="flex w-full flex-wrap items-center justify-between gap-2 border-t bg-background px-5 py-4 sm:border-0 sm:border-t-0 sm:border-b">
        <div className="flex items-center gap-2 text-xl">
          <IconCards className="size-6 text-primary" />
          <span className="font-semibold">
            <GridItemsTotal initialParams={initialParams} />
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-2 px-3 py-2">
        <SelectItemsPerPage />
        <SelectSort />
      </div>

      <Grid className="flex grow flex-col">
        <GridList>
          <GridItems initialParams={initialParams} />
        </GridList>
        <div className="mt-4 mb-4">
          <Pagination>
            <PaginationContent className="gap-2 rounded-lg border border-t-4 px-3 py-1">
              <PaginationItem className="size-8 **:[svg]:size-5">
                <FirstPage initialParams={initialParams} />
              </PaginationItem>
              <PaginationItem className="size-8 **:[svg]:size-5">
                <PreviousPage initialParams={initialParams} />
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
      </Grid>
    </main>
  );
}

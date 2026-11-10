import { IconSearch } from "@tabler/icons-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/breadcrumb";
import { ExpansionsSearchInput } from "@/features/tcgdex/components/input-expansions";
import { VirtualizerExpansions } from "@/features/tcgdex/components/virtualizer-expansions";
import { tcgDexQueryKeys } from "@/features/tcgdex/lib/react-query-keys";
import { getSets } from "@/features/tcgdex/lib/requests";
import { seo } from "@/lib/seo";

const expansionsQueryOptions = queryOptions({
  queryFn: async () => await getSets(),
  queryKey: tcgDexQueryKeys.expansions({}),
});

export const Route = createFileRoute("/sets/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.query({
      ...expansionsQueryOptions,
      staleTime: "static",
    });
  },
  head: () => ({
    meta: seo({
      keywords: ["pokemon", "pokemon trading card expansions", "pokemon trading card sets"],
      title: "Sets",
    }),
  }),
});

function RouteComponent() {
  const { data } = useSuspenseQuery(expansionsQueryOptions);

  return (
    <main className="flex grow flex-col">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Sets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <h1>
        {`Search `}
        <span className="text-primary">{data.data.sets.length}</span>
        {` Expansions`}
      </h1>

      <div className="sticky top-0 z-10 mx-auto flex w-full flex-wrap items-center bg-background">
        <div className="flex w-full items-center overflow-hidden border-y">
          <span className="px-3">
            <IconSearch className="size-5 shrink-0" />
          </span>
          <ExpansionsSearchInput />
        </div>
      </div>

      <VirtualizerExpansions sets={data.data.sets} />
    </main>
  );
}

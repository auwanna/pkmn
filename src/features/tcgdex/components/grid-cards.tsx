import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconMoodLookDown,
  IconPokeballOff,
} from "@tabler/icons-react";
import { Link } from "@/components/link";
import { PaginationLink, PaginationNext, PaginationPrevious } from "@/components/pagination";
import { Skeleton } from "@/components/skeleton";
import { ImageCard } from "@/features/tcgdex/components/card-image";
import { type UseCardsParams, useCards, useCardsMeta } from "@/features/tcgdex/hooks/use-cards";

export function GridItems({ initialParams }: { initialParams?: UseCardsParams }) {
  const { data, status } = useCards(initialParams);

  if (status === "pending") {
    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => {
          const key = `cards-list-skeleton-${i}`;
          return (
            <li className="flex flex-col gap-2 rounded-xs border bg-card p-2" key={key}>
              <Skeleton className="aspect-2.5/3.5 w-full bg-foreground/5" />
            </li>
          );
        })}
      </>
    );
  }

  if (status === "error") {
    return (
      <li className="col-span-full flex flex-col items-center justify-center gap-4 place-self-center font-display text-xl">
        <IconMoodLookDown className="size-40 text-muted-foreground" />
        <p className="max-w-xs text-center font-bold text-5xl">There was an error fetching cards</p>
      </li>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <li className="col-span-full flex flex-col items-center justify-center gap-4 place-self-center font-display text-xl">
        <IconPokeballOff className="size-40 text-muted-foreground" />
        <p className="max-w-xs text-center font-bold text-5xl">No cards were found.</p>
      </li>
    );
  }

  return (
    <>
      {data.data.map((data) => (
        <li className="group relative" key={data.id}>
          <Link className="focus-visible:ring-0" params={{ cardId: data.id }} to="/cards/$cardId">
            <ImageCard alt={data.name} src={data.image} loading="lazy" />
          </Link>
        </li>
      ))}
    </>
  );
}

export function GridItemsTotal({ initialParams }: { initialParams?: UseCardsParams }) {
  const { totalItems, status } = useCardsMeta(initialParams);

  if (status === "pending") {
    return <Skeleton className="h-7 w-20" />;
  }

  return <>{totalItems.toLocaleString() || "--"} cards found</>;
}

export function FirstPage({ initialParams }: { initialParams?: UseCardsParams }) {
  const { totalItems, currentPage } = useCardsMeta(initialParams);

  if (!currentPage || !totalItems) {
    return <LoadingPage />;
  }

  if (currentPage <= 1) {
    return (
      <span className="flex size-full cursor-not-allowed items-center justify-center p-2">
        <IconChevronLeftPipe />
      </span>
    );
  }

  return (
    <PaginationLink
      className="flex size-full items-center justify-center p-2 hover:scale-90"
      size="icon"
      to="."
      search={(prev) => ({ ...prev, page: 1 })}
    >
      <IconChevronLeftPipe />
    </PaginationLink>
  );
}
export function PreviousPage({ initialParams }: { initialParams?: UseCardsParams }) {
  const { currentPage, maxPages } = useCardsMeta(initialParams);

  if (!currentPage || !maxPages) {
    return <LoadingPage />;
  }

  if (currentPage <= 1) {
    return (
      <span className="flex size-full cursor-not-allowed items-center justify-center p-2">
        <IconArrowLeft />
      </span>
    );
  }

  return (
    <PaginationPrevious
      className="flex size-full items-center justify-center p-2 hover:scale-90"
      search={(prev) => ({ ...prev, page: currentPage - 1 })}
      to="."
    >
      <IconArrowLeft />
    </PaginationPrevious>
  );
}
export function CurrentPage({ initialParams }: { initialParams?: UseCardsParams }) {
  const { currentPage } = useCardsMeta(initialParams);
  return (
    <PaginationLink
      className="flex size-full items-center justify-center p-2 font-mono"
      search={(prev) => prev}
      size="icon"
      to="."
    >
      {currentPage}
    </PaginationLink>
  );
}

export function NextPage({ initialParams }: { initialParams?: UseCardsParams }) {
  const { currentPage, maxPages } = useCardsMeta(initialParams);

  if (!currentPage || !maxPages) {
    return <LoadingPage />;
  }

  if (currentPage >= maxPages) {
    return (
      <span className="flex size-full cursor-not-allowed items-center justify-center p-2">
        <IconArrowRight />
      </span>
    );
  }

  return (
    <PaginationNext
      className="flex size-full items-center justify-center p-2 hover:scale-90"
      search={(prev) => ({ ...prev, page: currentPage + 1 })}
      to="."
    >
      <IconArrowRight />
    </PaginationNext>
  );
}
export function LastPage({ initialParams }: { initialParams?: UseCardsParams }) {
  const { currentPage, maxPages } = useCardsMeta(initialParams);
  if (!currentPage || !maxPages) {
    return <LoadingPage />;
  }

  if (currentPage >= maxPages) {
    return (
      <span className="flex size-full cursor-not-allowed items-center justify-center p-2">
        <IconChevronRightPipe />
      </span>
    );
  }

  return (
    <PaginationLink
      className="flex size-full items-center justify-center p-2 hover:scale-90"
      search={(prev) => ({ ...prev, page: maxPages })}
      size="icon"
      to="."
    >
      <IconChevronRightPipe />
    </PaginationLink>
  );
}

export function LoadingPage() {
  return <Skeleton className="size-8 rounded-xs" />;
}

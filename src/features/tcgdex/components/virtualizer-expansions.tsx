import { IconCardsFilled, IconMoodSad } from "@tabler/icons-react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { matchSorter } from "match-sorter";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Badge } from "@/components/badge";
import { Link } from "@/components/link";
import { LogoImage } from "@/features/tcgdex/components/logo-image";
import type { GraphlqlSets } from "@/features/tcgdex/types";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/requests";
import { useAppStore } from "@/stores/use-app-store";

export function VirtualizerExpansions({ sets }: { sets: GraphlqlSets["sets"] }) {
  const setsRef = useRef<React.ComponentRef<"div">>(null);

  const query = useAppStore((state) => state.expansionQuery);
  const columns = useAppStore((state) => state.columns);
  const setColumns = useAppStore((state) => state.setColumns);

  const results = useMemo(
    () =>
      matchSorter(sets, query, {
        keys: ["name", "serie.name", "releaseDate"],
        threshold: matchSorter.rankings.CONTAINS,
        baseSort(a, b) {
          if (new Date(b.item.releaseDate) > new Date(a.item.releaseDate)) {
            return 1;
          }
          return -1;
        },
      }),
    [query, sets],
  );

  const estimateSize = useCallback(() => 250, []);

  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(results.length / columns),
    estimateSize,
    overscan: 2,
    scrollMargin: setsRef.current?.offsetTop ?? 0,
  });

  useEffect(() => {
    const scrollViewport = document.scrollingElement;
    if (!scrollViewport) return;

    const updateColumns = () => {
      if (!scrollViewport) return;
      const width = scrollViewport.clientWidth;

      setColumns(width >= 1280 ? 5 : width >= 1024 ? 4 : width >= 640 ? 3 : width >= 480 ? 2 : 1);
    };

    updateColumns();
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(scrollViewport);
    return () => resizeObserver.disconnect();
  }, [setColumns]);

  const items = virtualizer.getVirtualItems();
  const rowHeight = `${virtualizer.getTotalSize()}px`;

  if (!items.length && query.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <IconMoodSad className="size-32 text-foreground/75 md:size-48" />
        <p className="max-w-md text-base md:text-xl">
          No results found for&nbsp;
          <span className="font-bold text-primary">{`"${query}"`}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" ref={setsRef}>
      <div className="relative w-full" style={{ height: rowHeight }}>
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            transform: `translateY(${(items[0]?.start ?? 0) - virtualizer.options.scrollMargin}px)`,
          }}
        >
          <div className="flex flex-col divide-y divide-border">
            {items.map((row) => {
              const startIndex = row.index * columns;
              const endIndex = Math.min(startIndex + columns, results.length);
              const rowItems = results.slice(startIndex, endIndex);

              return (
                <div
                  className="grid grid-cols-1 xs:grid-cols-2 divide-x divide-border sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  data-index={row.index}
                  key={row.key}
                  ref={virtualizer.measureElement}
                >
                  {rowItems.map((item) => {
                    return (
                      <Link
                        className="group flex-col justify-start gap-2 rounded-none pb-2"
                        key={item.id}
                        params={{ setId: item.id }}
                        title={item.name}
                        to="/sets/$setId"
                        search={DEFAULT_SEARCH_PARAMS}
                      >
                        <div className="w-full p-3">
                          <LogoImage
                            alt={item.name ?? "a pokemon card"}
                            className="z-10 mx-auto h-40 border-0 object-contain object-center group-focus-within:scale-105 motion-safe:transition-transform"
                            ext="webp"
                            height={128}
                            hideTextOnError={true}
                            loading="lazy"
                            src={item.logo ?? ""}
                            width={192}
                          />
                        </div>
                        <p className="px-2 text-center">{item.name}</p>
                        <div className="my-auto flex flex-col gap-2">
                          <div className="flex items-center justify-center gap-1">
                            <Badge className="text-xs" variant="outline">
                              <span className="flex items-center gap-1">
                                {`${item.cardCount.official} / ${item.cardCount.total}`}
                                <IconCardsFilled className="size-4 text-primary" />
                              </span>
                            </Badge>
                          </div>
                          <p className="px-2 font-mono text-foreground/75 text-sm">
                            {item.releaseDate}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { IconMoodSad } from "@tabler/icons-react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { matchSorter } from "match-sorter";
import { useCallback, useEffect, useRef } from "react";
import { Badge } from "@/components/badge";
import { Link } from "@/components/link";
import { pokedex } from "@/features/pokeapi/data/pokedex";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/requests";
import { useAppStore } from "@/stores/use-app-store";
import { ImagePokemon } from "./image-pokemon";

export function VirtualizerPokedex() {
  const dexRef = useRef<React.ComponentRef<"div">>(null);
  const query = useAppStore((state) => state.pokedexQuery);
  const columns = useAppStore((state) => state.columns);
  const setColumns = useAppStore((state) => state.setColumns);

  const trimmedQuery = query.trim();
  const results =
    trimmedQuery.length === 0
      ? pokedex
      : matchSorter(pokedex, trimmedQuery, {
          keys: ["id", "name", "region", "types"],
          threshold: matchSorter.rankings.CONTAINS,
        });

  const estimateSize = useCallback(() => 250, []);

  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(results.length / columns),
    estimateSize,
    overscan: 2,
    scrollMargin: dexRef.current?.offsetTop ?? 0,
  });

  useEffect(() => {
    const virtualizerEl = document.getElementById("virtualizer-pokedex");
    if (!virtualizerEl) return;

    const updateColumns = () => {
      if (!virtualizerEl) return;
      const width = virtualizerEl.clientWidth;

      setColumns(width >= 1280 ? 6 : width >= 1024 ? 4 : width >= 448 ? 3 : width >= 320 ? 2 : 1);
    };

    updateColumns();
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(virtualizerEl);
    return () => resizeObserver.disconnect();
  }, [setColumns]);

  const items = virtualizer.getVirtualItems();
  const rowHeight = `${virtualizer.getTotalSize()}px`;

  if (items.length === 0 && query.length > 0) {
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
    <div id="virtualizer-pokedex" className="@container/virtualizer w-full" ref={dexRef}>
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
                  className="grid @5xl/virtualizer:grid-cols-4 @7xl/virtualizer:grid-cols-6 @md/virtualizer:grid-cols-3 @xs/virtualizer:grid-cols-2 grid-cols-1 divide-x divide-border"
                  data-index={row.index}
                  key={row.key}
                  ref={virtualizer.measureElement}
                >
                  {rowItems.map((item) => {
                    return (
                      <div
                        className="flex flex-col items-center bg-poketype/10 pt-4"
                        data-poketype={item.types[0]}
                        key={item.id}
                      >
                        <span className="self-end px-2 text-end font-mono font-semibold text-sm tracking-wider">
                          #{item.id.toString().padStart(4, "0")}
                        </span>
                        <div className="relative mx-auto size-20 px-2">
                          <ImagePokemon id={item.id} name={item.name} />
                        </div>
                        <Link
                          className="mb-4 min-w-0 rounded-sm px-2 outline-none hover:underline focus-visible:bg-poketype/25 focus-visible:ring-2 focus-visible:ring-poketype motion-safe:transition-colors"
                          to="/$dexId"
                          search={DEFAULT_SEARCH_PARAMS}
                          params={{ dexId: item.slug }}
                        >
                          {item.name}
                        </Link>
                        <div className="mt-auto flex w-full flex-wrap items-center justify-center text-sm">
                          {item.types.map((type) => {
                            return (
                              <Badge
                                className="relative grow rounded-none border-t-poketype bg-poketype/10 font-bold text-poketype capitalize"
                                data-poketype={type}
                                key={`${item.id}-${type}`}
                                variant="default"
                              >
                                {type}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
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

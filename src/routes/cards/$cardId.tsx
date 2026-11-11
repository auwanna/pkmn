import { IconInfoSquare } from "@tabler/icons-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { Optional } from "@/components/optional";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Label } from "@/components/label";
import { Link } from "@/components/link";
import { ImageCard } from "@/features/tcgdex/components/card-image";
import { tcgDexQueryKeys } from "@/features/tcgdex/lib/react-query-keys";
import { getCard } from "@/features/tcgdex/lib/requests";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/requests";
import { seo } from "@/lib/seo";
import { energyIcons } from "@/assets/images/energies";

const cardQueryOptions = (id: string) =>
  queryOptions({
    queryKey: tcgDexQueryKeys.card(id),
    throwOnError: false,
    queryFn: async ({ queryKey: [, , cardId] }) => {
      const response = await getCard(cardId).catch((_e) => null);
      if (!response) throw notFound();
      return response;
    },
  });

export const Route = createFileRoute("/cards/$cardId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const data = await context.queryClient.query({
      ...cardQueryOptions(params.cardId),
      staleTime: "static",
    });

    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const card = loaderData;

    const keywords = ["pokemon", "pokemon trading card"];
    let description = `Get details about ${card.name} from `;

    if (card.set.name) {
      description += `${card.set.name}.`;
      keywords.push(card.set.name);
    }

    if (card.category) keywords.push(card.category);
    if (card.rarity) keywords.push(card.rarity);

    return {
      links: [{ rel: "canonical", href: `/cards/${loaderData.id}` }],
      meta: seo({
        description,
        keywords: [card.name, ...keywords],
        title: `${card.name} - ${card.set.name}`,
        ...(card.image && {
          openGraph: {
            alt: `${card.name} Pokémon card`,
            height: 320,
            src: `${card.image}/high.webp`,
            width: 400,
          },
          twitter: {
            alt: `${card.name} Pokémon card`,

            height: 400,
            src: `${card.image}/high.webp`,
            width: 320,
          },
        }),
      }),
    };
  },
});

function RouteComponent() {
  const params = useParams({ from: "/cards/$cardId" });
  const { data } = useSuspenseQuery(cardQueryOptions(params.cardId));

  console.log(data.pricing);

  return (
    <main className="flex grow flex-col">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                render={
                  <Link
                    search={DEFAULT_SEARCH_PARAMS}
                    params={{ setId: data.set.id }}
                    to="/sets/$setId"
                  />
                }
              >
                {data.set.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="grid flex-1">
              <BreadcrumbPage className="truncate">{data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <h1 className="sticky top-0 z-10 flex h-16 items-center justify-center border-b bg-background px-3 py-3 font-bold font-display text-4xl">
        <span className="truncate">{data.name}</span>
      </h1>

      <article className="@container mx-auto w-full max-w-7xl px-3 py-8">
        <div className="grid @6xl:grid-cols-[max-content_1fr] grid-cols-1 gap-x-4 gap-y-8">
          <figure className="@6xl:sticky @6xl:top-20 mx-auto w-full @6xl:self-start">
            <ImageCard
              alt={data.name}
              className="mx-auto h-auto w-[24rem] object-contain drop-shadow-md"
              height={400}
              src={data.image}
              width={320}
              quality="high"
            />
            <figcaption className="sr-only">
              Official artwork for {data.name} from {data.set.name}
            </figcaption>
          </figure>

          <div className="@container/content flex flex-col gap-8 @6xl:px-8">
            <Optional
              data={data}
              name="description"
              render={(_, flavorText) => <p className="italic">{flavorText}</p>}
            />

            {/* Card Details */}
            <section className="flex flex-col gap-2">
              <h2>Details</h2>
              <dl className="grid w-full @lg/content:grid-cols-5 @md/content:grid-cols-4 @sm/content:grid-cols-3 grid-cols-2 place-items-start gap-4">
                <Optional
                  data={data}
                  name="category"
                  render={(key, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd>
                        <Link
                          to="/search"
                          className="justify-start hover:underline"
                          color="secondary"
                          search={(params) => ({
                            ...DEFAULT_SEARCH_PARAMS,
                            ...params,
                            categories: data,
                          })}
                        >
                          {data}
                        </Link>
                      </dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="set"
                  render={(_, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        Set
                      </Label>
                      <dd>
                        <Link
                          to="/sets/$setId"
                          params={{ setId: data.id }}
                          search={DEFAULT_SEARCH_PARAMS}
                          className="justify-start hover:underline"
                          color="secondary"
                        >
                          {data.name}
                        </Link>
                      </dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="stage"
                  render={(key, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd className="flex flex-wrap items-center gap-1">
                        <Link
                          key={`${key}-${data}`}
                          to="/search"
                          className="justify-start hover:underline"
                          color="secondary"
                          search={(params) => ({
                            ...DEFAULT_SEARCH_PARAMS,
                            ...params,
                            stages: data,
                          })}
                        >
                          {data}
                        </Link>
                      </dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="types"
                  render={(key, items) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        Energies
                      </Label>
                      <dd className="flex items-center gap-1">
                        {items.map((item) => (
                          <span key={`${key}-${item}`}>
                            <img
                              alt={`card type ${item}`}
                              height={20}
                              src={energyIcons[item.toLowerCase()]}
                              width={20}
                            />
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="level"
                  render={(key, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd>{data}</dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="hp"
                  render={(_, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        HP
                      </Label>
                      <dd className="font-mono">{data}</dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="evolveFrom"
                  render={(_, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        Evolves From
                      </Label>
                      <dd>
                        <Link
                          to="/search"
                          className="justify-start hover:underline"
                          color="secondary"
                          search={(params) => ({
                            ...DEFAULT_SEARCH_PARAMS,
                            ...params,
                            name: data,
                          })}
                        >
                          {data}
                        </Link>
                      </dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="illustrator"
                  render={(key, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd>
                        <Link
                          to="/search"
                          className="justify-start hover:underline"
                          color="secondary"
                          search={(params) => ({
                            ...DEFAULT_SEARCH_PARAMS,
                            ...params,
                            illustrators: data,
                          })}
                        >
                          {data}
                        </Link>
                      </dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="localId"
                  render={(_, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        ID
                      </Label>
                      <dd className="font-mono">{data}</dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="rarity"
                  render={(key, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd>
                        <Link
                          to="/search"
                          className="justify-start hover:underline"
                          color="secondary"
                          search={(params) => ({
                            ...DEFAULT_SEARCH_PARAMS,
                            ...params,
                            rarities: data,
                          })}
                        >
                          {data}
                        </Link>
                      </dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="dexId"
                  render={(_, items) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        Pokedex
                      </Label>
                      <dd className="flex flex-wrap items-center gap-1 font-mono">
                        {items.map((item) => (
                          <Link
                            className="justify-start hover:underline"
                            color="secondary"
                            key={`pokedex-${item}`}
                            to="/$dexId"
                            params={{ dexId: `${item}` }}
                            search={(params) => ({
                              ...DEFAULT_SEARCH_PARAMS,
                              ...params,
                            })}
                          >
                            #{item.toString().padStart(4, "0")}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="regulationMark"
                  render={(_, data) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        Regulation Mark
                      </Label>
                      <dd>
                        <Link
                          to="/search"
                          className="justify-start hover:underline"
                          color="secondary"
                          search={(params) => ({
                            ...DEFAULT_SEARCH_PARAMS,
                            ...params,
                            marks: data,
                          })}
                        >
                          {data}
                        </Link>
                      </dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="retreat"
                  render={(key, item) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        Retreat Cost
                      </Label>
                      <dd className="flex items-center gap-1">
                        {Array.from({ length: item }).map((_, i) => {
                          const ky = `${key}-${item}-${i}`;
                          return (
                            <span key={ky}>
                              <img
                                alt={`${item} energy`}
                                height={20}
                                src={energyIcons.colorless}
                                width={20}
                              />
                            </span>
                          );
                        })}
                        {item === 0 && <span>None</span>}
                      </dd>
                    </div>
                  )}
                />
                <Optional
                  data={data}
                  name="weaknesses"
                  render={(key, items) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd className="flex items-center gap-1">
                        {items.map((item) => (
                          <div className="flex items-center gap-1" key={`${key}-${item.value}`}>
                            <img
                              alt={`${item.type} energy`}
                              height={20}
                              src={energyIcons[item.type.toLowerCase()]}
                              width={20}
                            />
                            <span className="font-mono">{item.value}</span>
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}
                />

                <Optional
                  data={data}
                  name="resistances"
                  render={(key, items) => (
                    <div className="flex flex-col gap-2">
                      <Label render={<dt />} className="border-b-0 py-0 font-bold capitalize">
                        {key}
                      </Label>
                      <dd className="flex items-center gap-1">
                        {items.map((item, index) => (
                          <div
                            className="flex items-center gap-1"
                            key={`${key}-${item.type}-${index}`}
                          >
                            <img
                              alt={`${item.type} energy`}
                              height={20}
                              src={energyIcons[item.type.toLowerCase()]}
                              width={20}
                            />
                            <span className="font-mono">{item.value}</span>
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}
                />
              </dl>
            </section>

            {/* Abilities */}
            <Optional
              data={data}
              name="abilities"
              render={(key, items) => (
                <section className="flex flex-col gap-2">
                  <h2 className="capitalize">{key}</h2>
                  <ul className="flex flex-col gap-2">
                    {items.map((data) => (
                      <li key={`${key}-${data.name}`}>
                        <div className="flex flex-col">
                          <span className="justify-start font-bold">{data.name}</span>
                          <span className="text-muted-foreground text-sm">{data.type}</span>
                        </div>
                        <p className="mt-1">{data.effect}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            />

            {/* Attacks */}
            <Optional
              data={data}
              name="attacks"
              render={(key, items) => (
                <section className="flex flex-col gap-2">
                  <h2 className="capitalize">{key}</h2>
                  <ul className="flex flex-col gap-2">
                    {items.map((item) => (
                      <li
                        key={`${key}-${item.name}`}
                        data-energy={item.cost?.[0]?.toLowerCase()}
                        className="rounded-md border border-energy/20 border-t-4 bg-energy/10 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Optional
                              data={item}
                              name="cost"
                              render={(_, cost) => {
                                return cost.map((energy, costIndex) => (
                                  <span key={`${key}-${item.name}-cost-${costIndex}`}>
                                    <img
                                      alt={`energy ${energy}`}
                                      height={20}
                                      src={energyIcons[energy.toLowerCase()]}

                                      width={20}
                                    />
                                  </span>
                                ));
                              }}
                            />
                            <Optional
                              data={item}
                              name="name"
                              render={(_, name) => (
                                <p className="justify-start font-bold">{name}</p>
                              )}
                            />
                          </div>
                          <span className="font-bold font-mono">{item.damage}</span>
                        </div>
                        <Optional
                          data={item}
                          name="effect"
                          render={(_, effect) => <p className="mt-2">{effect}</p>}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            />

            {/* Prices */}
            <section>
              <h2 className="px-0">Prices</h2>
              <p className="flex items-center gap-2 text-muted-foreground text-sm">
                Prices are updated periodically and may not reflect current market value. Visit the
                marketplace sites for the most up-to-date information.
              </p>

              <ul className="@container/prices mt-4 flex flex-col gap-x-2 gap-y-6">
                <li className="relative @lg/prices:w-auto w-full grow">
                  <div className="flex h-full @sm/prices:grow grow-0 flex-col self-start">
                    <div className="flex flex-col justify-between gap-1 p-2">
                      <h3 className="font-bold capitalize">TCG Player</h3>
                      <Optional
                        data={data.pricing.tcgplayer}
                        name="updated"
                        render={(_key, value) => (
                          <p className="font-medium text-xs">
                            Last updated on {new Date(value).toLocaleDateString()}
                          </p>
                        )}
                      />
                    </div>

                    <div className="@container/market flex-1 p-4">
                      <Optional
                        data={data.pricing}
                        name="tcgplayer"
                        render={(_, data) => {
                          if (!data.prices[0]) return <EmptyPrice />;

                          return (
                            <div className="flex flex-col gap-4">
                              {data.prices.map((variant) => {
                                return (
                                  <div key={`tcg-${variant.label}`}>
                                    <Label
                                      render={<h4 />}
                                      className="border-b-4 font-bold font-display text-sm uppercase"
                                    >
                                      {variant.label} Variant
                                    </Label>

                                    <dl className="ml-2 grid @sm/market:grid-cols-3 @xl/market:grid-cols-5 grid-cols-2 gap-x-4 gap-y-2 border-l pt-2 pl-2">
                                      {variant.prices.map((price) => {
                                        return (
                                          <div
                                            className="flex flex-col justify-between"
                                            key={`tcg-${variant.label}-${price.label}`}
                                          >
                                            <Label
                                              render={<dt />}
                                              className="border-b-0 font-bold font-display text-muted-foreground text-sm uppercase"
                                            >
                                              {price.label}
                                            </Label>
                                            <dd className="font-mono text-lg">{price.value}</dd>
                                          </div>
                                        );
                                      })}
                                    </dl>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                </li>

                {/* cardmarket prices */}
                <li className="relative @lg/prices:w-auto w-full grow">
                  <div className="flex h-full @sm/prices:grow grow-0 flex-col self-start">
                    <div className="flex flex-col justify-between gap-1 p-2">
                      <h3 className="font-bold capitalize">Cardmarket</h3>
                      <Optional
                        data={data.pricing.cardmarket}
                        name="updated"
                        render={(_key, value) => (
                          <p className="font-medium text-xs">
                            Last updated on {new Date(value).toLocaleDateString()}
                          </p>
                        )}
                      />
                    </div>

                    <div className="@container/market flex-1 p-4">
                      <Optional
                        data={data.pricing}
                        name="cardmarket"
                        render={(_, data) => {
                          if (!data.prices[0]) return <EmptyPrice />;

                          return (
                            <div className="flex flex-col gap-4">
                              {data.prices.map((category) => {
                                return (
                                  <div key={`cm-${category.label}`}>
                                    <Label
                                      render={<h4 />}
                                      className="border-b-4 font-bold font-display text-sm uppercase"
                                    >
                                      {category.label}
                                    </Label>
                                    <dl className="ml-2 grid @sm/market:grid-cols-3 @xl/market:grid-cols-5 grid-cols-2 gap-x-4 gap-y-2 border-l pt-2 pl-2">
                                      {category.prices.map((price) => {
                                        return (
                                          <div
                                            className="flex flex-col justify-between"
                                            key={`cm-${price.label}`}
                                          >
                                            <Label
                                              render={<dt />}
                                              className="border-b-0 font-bold font-display text-muted-foreground text-sm uppercase"
                                            >
                                              {price.label}
                                            </Label>
                                            <dd className="font-mono text-lg">{price.value}</dd>
                                          </div>
                                        );
                                      })}
                                    </dl>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}

function EmptyPrice() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border py-8 text-center">
      <div className="mb-3 rounded-full border bg-muted p-3">
        <IconInfoSquare className="size-6" />
      </div>
      <p className="font-medium text-sm">No price data available</p>
      <p className="mt-1 text-muted-foreground text-xs">Check back later for updates</p>
    </div>
  );
}

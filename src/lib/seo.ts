type Image = { alt: string; src: string; height: number; width: number };

export const seo = ({
  title,
  description,
  keywords = [],
  openGraph,
  twitter,
}: {
  title: string;
  description?: string;
  keywords?: string[];
  openGraph?: Image;
  twitter?: Image;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { name: "og:type", content: "article" },
    { name: "og:title", content: title },
    { name: "og:description", content: description },

    ...(twitter
      ? [
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: title },
          { name: "twitter:description", content: description },
          { name: "twitter:image", content: twitter.src },
          { name: "twitter:image:alt", content: twitter.alt },
          { name: "twitter:image:height", content: twitter.height.toString() },
          { name: "twitter:image:width", content: twitter.width.toString() },
        ]
      : []),

    ...(openGraph
      ? [
          { name: "og:title", content: title },
          { name: "og:description", content: description },
          { name: "og:image", content: openGraph.alt },
          { name: "og:image:alt", content: openGraph.src },
          { name: "og:image:height", content: openGraph.height.toString() },
          { name: "og:image:width", content: openGraph.width.toString() },
        ]
      : []),
  ];

  return tags;
};

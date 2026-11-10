import { IconPokeballOff } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/cva";

type CardImageProps = Omit<React.ComponentProps<"img">, "alt" | "src"> & {
  alt: string;
  src: string | number | null;
  quality?: "high" | "low";
};

export function ImageCard({
  className,
  alt,
  quality = "low",
  src: initialSrc,
  ...props
}: CardImageProps) {
  const src = initialSrc ? `${initialSrc}/${quality}.webp` : "/images/card-back.png";
  const [error, setError] = useState<boolean | null>(null);

  if (error) {
    return (
      <div className="group-focus-within:-translate-y-2 hover:-translate-y-2 flex size-full flex-col items-center justify-center border bg-muted text-muted-foreground transition-transform">
        <span className="flex size-32 h-full w-full grow items-center justify-center">
          <IconPokeballOff className="size-32 opacity-75" />
        </span>
        <p className="flex w-full grow items-center justify-center border-input border-t p-2 text-center">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={cn(
        "group-focus-within:-translate-y-2 hover:-translate-y-2 size-full transition-[translate]",
        className,
      )}
      height={200}
      onError={() => setError(true)}
      src={src}
      width={150}
      {...props}
    />
  );
}

import { IconPokeballOff } from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/cva";

type LogoImageProps = React.ComponentProps<"img"> & {
  alt: string;
  src: string;
  ext: "webp" | "png";
  hideTextOnError?: boolean;
};

export function LogoImage({
  className,
  ext = "webp",
  alt,
  src,
  hideTextOnError = false,
  ...props
}: LogoImageProps) {
  const [error, setError] = useState<boolean | null>(null);

  if (error) {
    return (
      <div className="block p-2 focus-visible:ring-0">
        <div
          className={cn(
            "group-focus-within:-translate-y-2 group-hover:-translate-y-2 h-full w-full transition-transform",
            className,
          )}
        >
          <span className="flex size-32 h-full w-full grow items-center justify-center">
            <IconPokeballOff className="size-32 opacity-75" />
          </span>
        </div>
        <p
          className="flex w-full grow items-center justify-center border-input border-t p-2 text-center data-[hidden=true]:sr-only"
          data-hidden={hideTextOnError}
        >
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className="block p-2 focus-visible:ring-0">
      <img
        alt={alt}
        className={cn(
          "group-focus-within:-translate-y-2 group-hover:-translate-y-2 h-full w-full transition-transform",
          className,
        )}
        height={200}
        onError={() => setError(true)}
        src={`${src}.${ext}`}
        width={150}
        {...props}
      />
    </div>
  );
}

import { IconPokeballOff } from "@tabler/icons-react";
import { useState } from "react";
import { VisuallyHidden } from "@/components/visually-hidden";
import type { PokeAPIPokemon } from "@/features/pokeapi/types";
import { getSprite } from "@/features/pokeapi/utils";
import { cn } from "@/cva";
import { useAppStore } from "@/stores/use-app-store";

type PokemonImageProps = Omit<React.ComponentProps<"img">, "id" | "src" | "alt"> & {
  id: PokeAPIPokemon["id"];
  name: PokeAPIPokemon["name"];
};

export function ImagePokemon({ id, name, className, ...props }: PokemonImageProps) {
  const [error, setError] = useState<boolean | null>(null);
  const shiny = useAppStore((state) => state.isShiny);
  const style = useAppStore((state) => state.spriteType);

  if (error) {
    return (
      <div className="inline">
        <IconPokeballOff className={cn("size-full object-scale-down opacity-25", className)} />
        <VisuallyHidden>{name}</VisuallyHidden>
      </div>
    );
  }

  return (
    <img
      alt={`${name} ${style} art`}
      src={getSprite({ id, shiny, style })}
      className={cn("size-full object-scale-down", className)}
      height={64}
      width={64}
      onError={() => {
        setError(true);
      }}
      {...props}
    />
  );
}

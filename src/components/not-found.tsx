import { IconArrowNarrowLeft, IconPokeball, IconPokeballOff } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Button } from "@/components/button";
import { Link } from "@/components/link";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="flex grow flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center text-2xl text-muted-foreground">
        {children || (
          <>
            <IconPokeballOff className="size-[8em]" />
            <p className="max-w-sm text-center font-bold">
              The page you are looking for does not exist.
            </p>
          </>
        )}
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          type="button"
          className="font-bold"
          onClick={() => window.history.back()}
        >
          <IconArrowNarrowLeft className="size-4 shrink-0" />
          <span>Go back</span>
        </Button>
        <Button render={<Link to="/" />} variant="outline" type="button" className="font-bold">
          <IconPokeball className="size-4 shrink-0" />
          <span>Pokedex</span>
        </Button>
      </p>
    </div>
  );
}

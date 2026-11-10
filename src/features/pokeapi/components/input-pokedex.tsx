import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { VisuallyHidden } from "@/components/visually-hidden";
import { useAppStore } from "@/stores/use-app-store";

export function InputPokedex() {
  const query = useAppStore((state) => state.pokedexQuery);
  const setQuery = useAppStore((state) => state.setPokedexQuery);
  const placeholder = "Enter a name, type, region, or pokedex number";

  return (
    <>
      <VisuallyHidden>
        <Label htmlFor="expansion-input">{placeholder}</Label>
      </VisuallyHidden>
      <Input
        autoFocus
        className="grid h-12 flex-1 truncate rounded-none border-none pr-2 text-sm focus-visible:ring-0 sm:py-2 sm:pr-3 sm:text-base"
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder={placeholder}
        value={query}
      />
    </>
  );
}

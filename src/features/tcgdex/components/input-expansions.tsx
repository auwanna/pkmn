import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { VisuallyHidden } from "@/components/visually-hidden";
import { useAppStore } from "@/stores/use-app-store";

export function ExpansionsSearchInput() {
  const query = useAppStore((state) => state.expansionQuery);
  const setQuery = useAppStore((state) => state.setExpansionQuery);
  const placeholder = "Enter a series, set name, release date, or ptcgo code";

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

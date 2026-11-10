import { IconPokeball, IconRosetteDiscountCheck, IconSparkles } from "@tabler/icons-react";
import { useCallback } from "react";
import { safeParse } from "valibot";
import { Toggle } from "@/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group";
import { VisuallyHidden } from "@/components/visually-hidden";
import { SpriteStyleSchema } from "@/features/pokeapi/schemas";
import { useAppStore } from "@/stores/use-app-store";
import { toastManager } from "@/components/toast";

export function ToggleArtworkGroup() {
  const setSpriteType = useAppStore((state) => state.setSpriteType);
  const spriteType = useAppStore((state) => state.spriteType);

  const onValueChange = useCallback(
    (value: string[]) => {
      const x = value[0];
      if (!x) {
        setSpriteType("default");
        return;
      }

      const result = safeParse(SpriteStyleSchema, x);
      if (result.success) {
        setSpriteType(result.output);
        return;
      }

      toastManager.add({
        type: "error",
        description: `Invalid sprite type:\n${JSON.stringify(x, null, 2)}`,
      });
      setSpriteType("default");
    },
    [setSpriteType],
  );

  return (
    <ToggleGroup
      defaultValue={[spriteType]}
      value={[spriteType]}
      onValueChange={onValueChange}
      multiple={false}
    >
      <ToggleGroupItem
        className="border-t-4 transition-all data-[state=on]:border-t"
        value="default"
        variant="outline"
      >
        <VisuallyHidden>view default pokemon sprites</VisuallyHidden>
        <IconPokeball />
      </ToggleGroupItem>
      <ToggleGroupItem
        className="border-t-4 transition-all data-[state=on]:border-t"
        value="official"
        variant="outline"
      >
        <VisuallyHidden>view official pokemon artwork</VisuallyHidden>
        <IconRosetteDiscountCheck />
      </ToggleGroupItem>
      <ToggleGroupItem
        className="border-t-4 transition-all data-[state=on]:border-t"
        value="showdown"
        variant="outline"
      >
        <VisuallyHidden>view smogon artwork</VisuallyHidden>
        <img
          alt="smogon logo by zracknel"
          height={24}
          rel="noreferrer noopener"
          src="https://www.smogon.com/__assets/zracknel-beta-C54MC4RN.svg"
          width={24}
        />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function ToggleShiny(_props: React.ComponentProps<typeof Toggle>) {
  const setIsShiny = useAppStore((state) => state.setIsShiny);

  return (
    <Toggle
      className="border-x border-t-4 border-b transition-all data-[state=on]:border-t"
      onPressedChange={setIsShiny}
    >
      <VisuallyHidden>view shiny versions of artworks</VisuallyHidden>
      <IconSparkles />
    </Toggle>
  );
}

import colorless from "./colorless.png";
import darkness from "./darkness.png";
import dragon from "./dragon.png";
import fairy from "./fairy.png";
import fighting from "./fighting.png";
import fire from "./fire.png";
import grass from "./grass.png";
import lightning from "./lightning.png";
import metal from "./metal.png";
import psychic from "./psychic.png";
import water from "./water.png";

export const energyIcons: Record<string, string> = {
  colorless,
  darkness,
  dragon,
  fairy,
  fighting,
  fire,
  grass,
  lightning,
  metal,
  psychic,
  water,
};

export type Energy = keyof typeof energyIcons;

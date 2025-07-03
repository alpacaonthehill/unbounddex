import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  return {
    types: [
      "BUG",
      "DARK",
      "DRAGON",
      "ELECTRIC",
      "FAIRY",
      "FIGHTING",
      "FIRE",
      "FLYING",
      "GHOST",
      "GRASS",
      "GROUND",
      "ICE",
      "NORMAL",
      "POISON",
      "PSYCHIC",
      "ROCK",
      "STEEL",
      "WATER",
    ],
  };
};

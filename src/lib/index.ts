export type MonExtract = [
  string, // Name
  string, // Form
  number, // Type 1 Index
  number // Type 2 Index
];

export type Ability = [
  string, // Name,
  string // Description
];

export type Move = [
  string, // Name
  number, // Type
  number, // Split
  number, // Power
  number, // Accuracy
  number // TM, HM No.
];

export type MoveSplit = [
  string, // Name
  string // Icon
];

export type MonType = [
  string, // Name
  string // Icon
];

type ExpByGrowthRate = {
  Erratic: number;
  Fast: number;
  "Medium Fast": number;
  "Medium Slow": number;
  Slow: number;
  Fluctuating: number;
};

type GrowthRate = keyof ExpByGrowthRate;

export type Mon = [
  string, // Name
  string, // Form
  [string, string][], // Forms
  number, // Type 1
  number, // Type 2
  number, // Ability 1
  number, // Ability 2
  number, // Hidden Ability
  number, // HP
  number, // Attack
  number, // Defense
  number, // Sp. Atk
  number, // Sp. Def
  number, // Speed
  [number, [string, string, string][]], //Evolutions
  number, // National No.
  number, // Borrius No.
  number, // Catch Rate
  string, // Item 1
  string, // Item 2
  string, // Egg Group 1
  string, // Egg Group 2
  number, // Gender Ratio
  number, // Egg Cycles
  GrowthRate, // Growth Rate
  number, // EV Yields
  number[], // Evo Moves
  number[], // Lvl Up Levels
  number[], // Lvl Up Moves
  number[], // TM, HM Moves
  number[], // Egg Moves
  number[], // Tutor Moves
  string, // Icon
  string // Sprite
];

export type MappedMon = [
  string, // Name
  string, // Form
  [string, string][], // Forms
  [MonType, number], // Type 1
  [MonType, number], // Type 2
  Ability, // Ability 1
  Ability, // Ability 2
  Ability, // Hidden Ability
  number, // HP
  number, // Attack
  number, // Defense
  number, // Sp. Atk
  number, // Sp. Def
  number, // Speed
  [number, [string, string, string][]], //Evolutions
  number, // National No.
  number, // Borrius No.
  number, // Catch Rate
  string, // Item 1
  string, // Item 2
  string, // Egg Group 1
  string, // Egg Group 2
  number, // Gender Ratio
  number, // Egg Cycles
  GrowthRate, // Growth Rate
  number, // EV Yields
  Move[], // Evo Moves
  number[], // Lvl Up Levels
  Move[], // Lvl Up Moves
  Move[], // TM, HM Moves
  Move[], // Egg Moves
  Move[], // Tutor Moves
  string, // Icon
  string // Sprite
];

export const iconPngHeader =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAA";
export const spritePngHeader =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAA";
export const typePngHeader =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAIAAAC6iKlyAAAACXBIWXMAAA7BAAAOwQG4kWvtAAA";
export const splitPngHeader =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAA9CAIAAAD+saqTAAAACXBIWXMAAC4jAAAuIwF4pT92AAA";

export function urlFromNameAndForm(name: string, form: string) {
  return (
    name.replaceAll(" ", "-").replaceAll("Gigantamax", "gmax") +
    (form ? "-" + form.split("-")[0].split(" ")[0] : "")
  )
    .replaceAll("'", "")
    .replaceAll(".", "")
    .replaceAll(":", "")
    .replaceAll("%", "")
    .toLowerCase();
}

export function mapMonData(
  mon: Mon,
  abilities: Ability[],
  moves: Move[],
  types: MonType[]
) {
  const mapped = mon.map((info, idx) => {
    if (idx >= 3 && idx <= 4) {
      return info === -1 ? [["", ""], -1] : [types[info as number], info as number];
    } else if (idx >= 5 && idx <= 7) {
      return info === -1 ? ["", ""] : abilities[info as number];
    } else if (idx === 26 || (idx >= 28 && idx <= 31)) {
      return (info as number[]).map((moveIdx) => moves[moveIdx]);
    } else {
      return info;
    }
  }) as MappedMon;
  return mapped;
}

export function compareArrays(ary1: number[], ary2: number[]) {
  let i = 0;
  while (i < Math.min(ary1.length, ary2.length)) {
    if (ary1[i] < ary2[i]) {
      return -1;
    } else if (ary1[i] > ary2[i]) {
      return 1;
    }
    i += 1;
  }
  if (ary1.length > i) {
    return 1;
  } else if (ary2.length > i) {
    return -1;
  } else {
    return 0;
  }
}

export function matchedIndices(name: string, form: string, searchString: string) {
  const nameWords = name.split(" ").filter((w) => w);
  const formWords = form.split(" ").filter((w) => w);
  const words = [...nameWords, ...formWords].map((w) => w.toLowerCase());
  const searchWords = searchString
    .split(" ")
    .filter((w) => w)
    .map((w) => w.toLowerCase());
  let result: number[] = [];
  let i = 0;
  let j: number;
  let incorrectPaths: number[][] = [];
  while (i < searchWords.length) {
    j = 0;
    while (j < words.length) {
      if (
        words[j].startsWith(searchWords[i]) &&
        !result.includes(j) &&
        !incorrectPaths.filter((path) => !compareArrays(path, [...result, j])).length
      ) {
        result.push(j);
        i += 1;
        break;
      }
      j += 1;
    }
    if (j === words.length) {
      if (i === 0) {
        return [];
      } else {
        incorrectPaths.push(result.slice());
        result.pop();
        i -= 1;
      }
    }
  }
  return result.map((idx) =>
    idx >= nameWords.length ? idx - nameWords.length + 10 : idx
  );
}

export const expByGrowthRate: ExpByGrowthRate = {
  Erratic: 600_000,
  Fast: 800_000,
  "Medium Fast": 1_000_000,
  "Medium Slow": 1_059_860,
  Slow: 1_250_000,
  Fluctuating: 1_640_000,
};

export const fixedMoves = [
  "Bide",
  "Counter",
  "Dragon Rage",
  "Endeavor",
  "Final Gambit",
  "Metal Burst",
  "Mirror Coat",
  "Nature's Mad",
  "Night Shade",
  "Psywave",
  "Seismic Toss",
  "Super Fang",
  "Sonic Boom",
];

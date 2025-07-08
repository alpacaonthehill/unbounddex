import type { MonExtract, Ability, Move, MoveSplit, MonType, Mon } from "$lib";

type Cache = {
  extracts: MonExtract[] | null;
  abilities: Ability[] | null;
  moves: Move[] | null;
  splits: MoveSplit[] | null;
  types: MonType[] | null;
  mons: {
    [k: string]: Mon;
  };
  query: string;
  referrer: string;
};

export const cache: Cache = $state({
  extracts: null,
  abilities: null,
  moves: null,
  splits: null,
  types: null,
  mons: {},
  query: "",
  referrer: "",
});

const dataKeys = Object.keys(cache).filter(
  (key) => !["mons", "query", "referrer"].includes(key)
);
type DataKey = Exclude<keyof Cache, "mons" | "query" | "referrer">;

export function updateCache(keys: string[]) {
  const keyList = keys
    .filter((key) => dataKeys.includes(key) && !cache[key as DataKey])
    .join();
  if (keyList.length) {
    fetch(`/api?keys=${keyList}`).then((response) =>
      response.json().then((json) => {
        for (const key of Object.keys(json)) {
          cache[key as DataKey] = json[key];
        }
      })
    );
  }
}

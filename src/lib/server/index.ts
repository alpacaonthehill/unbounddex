import type { MonExtract, Ability, Move, MoveSplit, MonType, Mon } from "$lib";

async function monDataFromUrls(urls: string[]) {
  const entries = await Promise.all(
    urls.map((url) => import(`./data/mons/${url}.json`).then((mod) => [url, mod.default]))
  );
  return Object.fromEntries(entries) as { [k: string]: Mon };
}

async function dataFromKeys(keys: string[]) {
  const entries = await Promise.all(
    keys.map((key) => import(`./data/${key}.json`).then((mod) => [key, mod.default]))
  );
  return Object.fromEntries(entries) as {
    extracts?: MonExtract[];
    abilities?: Ability[];
    moves?: Move[];
    splits?: MoveSplit[];
    types?: MonType[];
  };
}

export { monDataFromUrls, dataFromKeys };

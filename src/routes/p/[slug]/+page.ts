import { error, redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import { cache } from "$lib/cache.svelte";
import type { MappedMon } from "$lib";

export const load: PageLoad = async ({ params, fetch }) => {
  const monURL = params.slug;
  if (monURL in redirects) {
    redirect(307, redirects[params.slug]);
  }
  if (monURL in cache.mons && cache.abilities && cache.moves && cache.types) {
    return { mon: null };
  }
  try {
    const response = await fetch(`/api?mon=${monURL}`);
    const json = await response.json();
    return {
      mon: json as MappedMon,
    };
  } catch (err) {
    error(400);
  }
};

const redirects: { [k: string]: string } = {
  unown: "unown-a",
  castform: "castform-normal",
  deoxys: "deoxys-normal",
  burmy: "burmy-plant",
  wormadam: "wormadam-plant",
  cherrim: "cherrim-overcast",
  shellos: "shellos-west",
  gastrodon: "gastrodon-west",
  hippopotas: "hippopotas-male",
  hippowdon: "hippowdon-male",
  giratina: "giratina-altered",
  shaymin: "shaymin-land",
  unfezant: "unfezant-male",
  basculin: "basculin-red",
  deerling: "deerling-spring",
  sawsbuck: "sawsbuck-spring",
  frillish: "frillish-male",
  jellicent: "jellicent-male",
  tornadus: "tornadus-incarnate",
  thundurus: "thundurus-incarnate",
  landorus: "landorus-incarnate",
  keldeo: "keldeo-ordinary",
  meloetta: "meloetta-aria",
  vivillon: "vivillon-meadow",
  pyroar: "pyroar-male",
  flabebe: "flabebe-red",
  floette: "floette-red",
  florges: "florges-red",
  furfrou: "furfrou-natural",
  meowstic: "meowstic-male",
  aegislash: "aegislash-shield",
  pumpkaboo: "pumpkaboo-small",
  gourgeist: "gourgeist-small",
  xerneas: "xerneas-neutral",
  zygarde: "zygarde-50",
  oricorio: "oricorio-baile",
  lycanroc: "lycanroc-midday",
  wishiwashi: "wishiwashi-solo",
  minior: "minior-meteor",
  mimikyu: "mimikyu-disguised",
  toxtricity: "toxtricity-amped",
  sinistea: "sinistea-phony",
  polteageist: "polteageist-phony",
  alcremie: "alcremie-strawberry",
  eiscue: "eiscue-ice",
  indeedee: "indeedee-male",
  morpeko: "morpeko-full",
  urshifu: "urshifu-single",
  basculegion: "basculegion-male",
  enamorus: "enamorus-incarnate",
};

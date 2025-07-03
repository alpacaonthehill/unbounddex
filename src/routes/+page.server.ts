import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch("/data/search/mons.json");
  const json = await response.json();
  return {
    mons: json as [string, string, number, number][],
  };
};

import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { monDataFromUrls, dataFromKeys } from "$lib/server";
import { mapMonData } from "$lib";

export const GET: RequestHandler = async ({ request }) => {
  const mon = new URL(request.url).searchParams.get("mon");
  const mons = new URL(request.url).searchParams.get("mons");
  const keys = new URL(request.url).searchParams.get("keys");
  try {
    if (mon) {
      const data = await Promise.all([
        monDataFromUrls([mon]),
        dataFromKeys(["abilities", "moves", "types"]),
      ]);
      const mappedMon = mapMonData(
        data[0][mon],
        data[1].abilities!,
        data[1].moves!,
        data[1].types!
      );
      return json(mappedMon);
    } else if (mons) {
      const data = await monDataFromUrls(mons.split(","));
      return json(data);
    } else if (keys) {
      const data = await dataFromKeys(keys.split(","));
      return json(data);
    }
    throw new Error("unreachable");
  } catch (err) {
    error(400);
  }
};

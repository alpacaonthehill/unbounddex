<script lang="ts">
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import { goto, replaceState, preloadData } from "$app/navigation";
  import { scrollY } from "svelte/reactivity/window";
  import { MediaQuery } from "svelte/reactivity";

  import { urlFromNameAndForm, iconFromUrl } from "$lib";

  let { data }: PageProps = $props();
  let { mons, types } = data;
  let headerImg: HTMLElement | null = $state(null);
  let searchBox: HTMLElement | null = $state(null);
  let query = page.url.searchParams.get("query") ?? page.state.query ?? "";
  let searchString = $state(query);
  let headerFixed = $state(!!query);

  function compareArrays(ary1: number[], ary2: number[]) {
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

  function matchedIndices(name: string, form: string, searchString: string) {
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

  const mdScreen = new MediaQuery("min-width: 396px");
  const lgScreen = new MediaQuery("min-width: 440px");
  let rootFontSize = $derived(lgScreen.current ? 20 : mdScreen.current ? 18 : 16);
  let scrollCount = $derived(
    Math.floor((scrollY.current ?? 0) / 3.283333 / rootFontSize)
  );
  let searchedMons = $derived(
    mons
      .map(
        (mon) =>
          [...mon, matchedIndices(mon[0], mon[1], searchString)] as [
            string,
            string,
            number,
            number,
            number[],
          ]
      )
      .filter((mon) => mon[4].length)
      .sort(
        (mon1, mon2) =>
          compareArrays(mon1[4], mon2[4]) ||
          mon1[0].localeCompare(mon2[0], "en", { sensitivity: "base" }) ||
          mon1[1].localeCompare(mon2[1], "en", { sensitivity: "base" })
      )
  );
  let itemCount = $derived(
    Math.min(30 + Math.floor(scrollCount / 10) * 10, searchedMons.length)
  );
  let highWatermark = $state(0);
  let showingMons = $derived(searchedMons.slice(0, Math.max(itemCount, highWatermark)));
  let exactMatch = $derived(
    itemCount === 1 ||
      (searchedMons.length > 0 &&
        !searchedMons[0][1] &&
        (!searchString.localeCompare(searchedMons[0][0], "en", { sensitivity: "base" }) ||
          searchedMons.every(
            ([name]) =>
              name.endsWith(searchedMons[0][0]) ||
              name.endsWith(searchedMons[0][0] + " X") ||
              name.endsWith(searchedMons[0][0] + " Y")
          )))
  );
  let topSearchUrl = $derived(
    searchedMons.length ? urlFromNameAndForm(searchedMons[0][0], searchedMons[0][1]) : ""
  );
  $effect(() => {
    if (itemCount > highWatermark) {
      highWatermark = itemCount;
    }
  });
</script>

<svelte:head>
  <meta name="theme-color" content="rgb(51,51,51)" />
</svelte:head>

{#if !headerFixed}
  <div class="header-pic" relative w="full" h="0" p="t-120/600">
    <img src="/logo.png" bind:this={headerImg} alt="Unbound Dex" class="placed" />
  </div>

  <h2 class="header-caption" c="neutral-4" align="center">
    for Pokémon Unbound v2.1.1.1
  </h2>
{/if}

<div
  p="x-3 y-2"
  bg="[rgb(51,51,51)]"
  class={headerFixed ? "fixed z-2 w-full max-w-120 top-0 left-1/2 -translate-x-1/2" : ""}
>
  <row p="x-2" rounded="md" bg="white" c="neutral-8" items="center">
    {#if headerFixed}
      <a
        href="/"
        m="t-1.6"
        onclick={() => {
          searchString = "";
          headerFixed = false;
        }}
        aria-label="back"
      >
        <icon:arrow-left></icon:arrow-left>
      </a>
    {:else}
      <icon:magnifying-glass></icon:magnifying-glass>
    {/if}
    <input
      type="search"
      bind:this={searchBox}
      bind:value={searchString}
      flex="1"
      p="2"
      bg="white"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      oninput={() => {
        scrollTo({ top: 0, behavior: "instant" });
        highWatermark = 0;
        if (exactMatch) {
          preloadData(`/p/${topSearchUrl}`);
        }
      }}
      onfocus={() => {
        headerFixed = true;
      }}
      onkeydown={(event) => {
        if (event.key === "Enter" && exactMatch) {
          replaceState(`/?query=${searchString}`, { query: searchString });
          goto(`/p/${topSearchUrl}`, {
            state: { query: searchString },
          });
        }
      }}
    />
    {#if exactMatch}
      <p text="xs" b="1 neutral-5" m="r-4" p="x-1" rounded="md" c="neutral-5">enter</p>
    {/if}
    {#if searchString !== ""}
      <button
        m="t-1.6"
        onclick={() => {
          searchString = "";
          searchBox?.focus();
        }}
        aria-label="clear"
      >
        <icon:x-mark></icon:x-mark>
      </button>
    {/if}
  </row>
</div>

<stack p="l-2.5 r-3" class={headerFixed ? "m-t-14" : ""}>
  {#if !showingMons.length && searchString}
    <h3 p="2" c="neutral-4" align="center">No results</h3>
  {:else}
    {#each showingMons as [monName, monForm, type1idx, type2idx, indices], idx}
      {@const monURL = urlFromNameAndForm(monName, monForm)}
      {@const iconURL = iconFromUrl(monURL)}
      {@const type1 = types[type1idx]}
      {@const type2 = types[type2idx]}
      {@const highlights: [number, number, "name" | "form"][] = indices.map((index, i) =>
        index < 10
          ? [index, searchString.split(" ")[i].length, "name"]
          : [index - 10, searchString.split(" ")[i].length, "form"]
      )}
      <button
        style={exactMatch && idx === 0 ? "background-color: rgb(64,64,51)" : ""}
        bg="hover:neutral-7 active:neutral-6"
        class="text-left"
        ontouchstart={() => {}}
        onclick={() => {
          replaceState(`/?query=${searchString}`, { query: searchString });
          goto(`/p/${monURL}`, { state: { query: searchString } });
        }}
      >
        <row
          p="y-1"
          m="l-0.5"
          b="b-1 neutral-5"
          justify="around"
          items="center"
          overflow="visible"
        >
          <div relative w="8" h="8" class="-m-x-0.5" m="r-1 b-1.5">
            <img src="/icons/{iconURL}.png" alt={monURL} class="placed" />
          </div>
          <stack w="46">
            {@render Highlighted(monName, highlights, "name", !monForm)}
            {#if monForm}
              {@render Highlighted(monForm, highlights, "form")}
            {/if}
          </stack>
          <row gap="1.5">
            <div relative w="12.5" h="4.166667">
              <img src="/types/{type1}.png" alt={type1} class="placed" />
            </div>
            {#if type2}
              <div relative w="12.5" h="4.166667">
                <img src="/types/{type2}.png" alt={type2} class="placed" />
              </div>
            {:else}
              <div w="12.5"></div>
            {/if}
          </row>
        </row>
      </button>
    {/each}
  {/if}
</stack>

{#snippet Highlighted(
  label: string,
  highlights: [number, number, string][],
  kind: "name" | "form",
  extraHeight = false
)}
  <p class={kind === "form" ? "c-neutral-4 text-sm" : extraHeight ? " leading-11" : ""}>
    {#each label.split(" ") as part, idx}
      {@const highlight = highlights.find(([i, _, k]) => i === idx && k === kind)}
      {@const split = highlight === undefined ? 0 : highlight[1]}
      {#if idx}<span></span>{/if}
      <span c="blue-2">{part.slice(0, split)}</span><span>{part.slice(split)}</span>
    {/each}
  </p>
{/snippet}

{#if !headerFixed}
  <div class="fixed w-full max-w-120 bottom-0 left-1/2 -translate-x-1/2">
    <p wrap="break" p="x-6 b-2" c="neutral-4" text="xs">
      Data from <a
        href="https://github.com/Skeli789/Complete-Fire-Red-Upgrade"
        target="_blank"
        text="xs"
        underline="~ offset-2">CFRU</a
      >
      and
      <a
        href="https://github.com/Skeli789/Dynamic-Pokemon-Expansion"
        target="_blank"
        text="xs"
        underline="~ offset-2">DPE</a
      >, by the main developer of Pokémon Unbound, Skeli.
    </p>
    <p wrap="break" p="x-6 b-2" c="neutral-4" text="xs">
      Copyrighted assets are used under Fair Use. This site is not affiliated with Skeli,
      Nintendo, or Game Freak.
    </p>
  </div>
{/if}

<style>
  .header-pic {
    margin-top: 5vh;
  }
  @media (min-height: 400px) {
    .header-pic {
      margin-top: 20vh;
    }
  }
  .header-caption {
    margin-bottom: 0vh;
  }
  @media (min-height: 400px) {
    .header-caption {
      margin-bottom: 5vh;
    }
  }
</style>

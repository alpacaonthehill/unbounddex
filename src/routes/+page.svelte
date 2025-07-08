<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { scrollY } from "svelte/reactivity/window";
  import { MediaQuery } from "svelte/reactivity";

  import { cache, updateCache } from "$lib/cache.svelte";
  import {
    urlFromNameAndForm,
    compareArrays,
    matchedIndices,
    iconPngHeader,
    typePngHeader,
  } from "$lib";

  let searchBox: HTMLElement | null = $state(null);
  let loadingURLs: string[] = $state([]);
  let loadedURLs: string[] = $derived(Object.keys(cache.mons));
  let searchString = $state(cache.query);
  let headerFixed = $state(!!cache.query || !!cache.referrer);

  onMount(() => {
    updateCache(["extracts"]);
    updateCache(["types"]);
    updateCache(["abilities", "moves", "splits"]);
  });

  let extracts = $derived(cache.extracts ?? []);
  let searchedItems = $derived(
    extracts
      .map((extract) => ({
        extract,
        indices: matchedIndices(extract[0], extract[1], searchString),
      }))
      .filter(({ indices }) => indices.length)
      .sort(
        (l, r) =>
          compareArrays(l.indices, r.indices) ||
          l.extract[0].localeCompare(r.extract[0], "en", { sensitivity: "base" }) ||
          l.extract[1].localeCompare(r.extract[1], "en", { sensitivity: "base" })
      )
  );

  const mdScreen = new MediaQuery("min-width: 396px");
  const lgScreen = new MediaQuery("min-width: 440px");
  let rootFontSize = $derived(lgScreen.current ? 20 : mdScreen.current ? 18 : 16);

  let highWatermark = $state(0);
  let scrollCount = $derived(
    Math.floor((scrollY.current ?? 0) / 3.283333 / rootFontSize)
  );
  let itemCount = $derived(
    Math.min(30 + Math.floor(scrollCount / 10) * 10, searchedItems.length)
  );
  let showingItems = $derived(searchedItems.slice(0, Math.max(itemCount, highWatermark)));

  $effect(() => {
    if (itemCount > highWatermark) {
      const requiredURLs = searchedItems
        .slice(highWatermark, itemCount)
        .map(({ extract: [name, form] }) => urlFromNameAndForm(name, form))
        .filter((url) => !loadingURLs.includes(url) && !loadedURLs.includes(url));
      if (requiredURLs.length) {
        loadingURLs = [...loadingURLs, ...requiredURLs];
        fetch(`/api?mons=${requiredURLs.join()}`).then((response) =>
          response.json().then((json) => {
            cache.mons = {
              ...cache.mons,
              ...json,
            };
            loadingURLs = loadingURLs.filter((url) => !requiredURLs.includes(url));
          })
        );
      }
      highWatermark = itemCount;
    }
  });

  let exactMatch = $derived(
    itemCount === 1 ||
      (searchedItems.length > 0 &&
        !searchedItems[0].extract[1] &&
        (!searchString.localeCompare(searchedItems[0].extract[0], "en", {
          sensitivity: "base",
        }) ||
          searchedItems.every(
            ({ extract: [name] }) =>
              name.endsWith(searchedItems[0].extract[0]) ||
              name.endsWith(searchedItems[0].extract[0] + " X") ||
              name.endsWith(searchedItems[0].extract[0] + " Y")
          )))
  );
  let topSearchUrl = $derived(
    searchedItems.length
      ? urlFromNameAndForm(searchedItems[0].extract[0], searchedItems[0].extract[1])
      : ""
  );
</script>

<svelte:head>
  <meta name="theme-color" content="rgb(51,51,51)" />
</svelte:head>

{#if !headerFixed}
  <div class="header-pic" relative w="full" h="0" p="t-120/600">
    <img src="/logo.png" alt="Unbound Dex" class="placed" />
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
      {#if cache.referrer}
        <button
          m="t-1.6"
          onclick={() => {
            goto(`/p/${cache.referrer}`);
          }}
          aria-label="back"
        >
          <icon:chevron-left></icon:chevron-left>
        </button>
      {:else}
        <button
          m="t-1.6"
          onclick={() => {
            searchString = "";
            headerFixed = false;
          }}
          aria-label="back"
        >
          <icon:arrow-left></icon:arrow-left>
        </button>
      {/if}
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
        cache.referrer = "";
      }}
      onfocus={() => {
        headerFixed = true;
      }}
      onkeydown={(event) => {
        if (event.key === "Enter" && exactMatch) {
          cache.query = searchString;
          goto(`/p/${topSearchUrl}`);
        }
      }}
    />
    {#if exactMatch}
      <div m="t-1.6 r-6">
        <icon:arrow-turn-down-left w="4.5" h="4.5" c="[rgb(64,64,51)]"
        ></icon:arrow-turn-down-left>
      </div>
    {/if}
    {#if searchString}
      <button
        m="t-1.6"
        onclick={(event) => {
          searchString = "";
          cache.referrer = "";
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
  {#if !showingItems.length && searchString}
    <h3 p="2" c="neutral-4" align="center">No results</h3>
  {:else}
    {#each showingItems as { extract: [monName, monForm, type1idx, type2idx], indices }, idx}
      {@const monURL = urlFromNameAndForm(monName, monForm)}
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
          cache.query = searchString;
          goto(`/p/${monURL}`);
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
            {#if loadedURLs.includes(monURL)}
              <img
                src={`${iconPngHeader}${cache.mons[monURL][32]}`}
                alt={monURL}
                class="placed"
              />
            {/if}
          </div>
          <stack w="46">
            {@render Highlighted(monName, highlights, "name", !monForm)}
            {#if monForm}
              {@render Highlighted(monForm, highlights, "form")}
            {/if}
          </stack>
          <row gap="1.5">
            <div relative w="12.5" h="4.166667">
              {#if cache.types}
                <img
                  src={`${typePngHeader}${cache.types[type1idx][1]}`}
                  alt={cache.types[type1idx][0]}
                  class="placed"
                />
              {/if}
            </div>
            <div relative w="12.5" h="4.166667">
              {#if type2idx !== -1 && cache.types}
                <img
                  src={`${typePngHeader}${cache.types[type2idx][1]}`}
                  alt={cache.types[type2idx][0]}
                  class="placed"
                />
              {/if}
            </div>
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

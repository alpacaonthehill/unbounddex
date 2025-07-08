<script lang="ts">
  import type { PageProps } from "./$types";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { scrollY } from "svelte/reactivity/window";
  import { MediaQuery } from "svelte/reactivity";
  import type { Attachment } from "svelte/attachments";

  import EvoChart from "./EvoChart.svelte";

  import { cache, updateCache } from "$lib/cache.svelte";
  import {
    iconPngHeader,
    spritePngHeader,
    typePngHeader,
    splitPngHeader,
    urlFromNameAndForm,
    mapMonData,
    expByGrowthRate,
    fixedMoves,
    type Move,
  } from "$lib";

  let { data }: PageProps = $props();
  let monURL = $derived(page.params.slug);
  let mon = $derived(
    data.mon ??
      mapMonData(cache.mons[monURL], cache.abilities!, cache.moves!, cache.types!)
  );
  let [
    monName,
    monForm,
    forms,
    type1,
    type2,
    ability1,
    ability2,
    ability3,
    hp,
    atk,
    def,
    spA,
    spD,
    spd,
    evoInfo,
    nationalNo,
    borriusNo,
    catchRate,
    item1,
    item2,
    eggGroup1,
    eggGroup2,
    genderRatio,
    eggCycles,
    growthRate,
    evYield,
    evoMoves,
    levelupLevels,
    levelupMoves,
    tmMoves,
    eggMoves,
    tutorMoves,
    iconBase64,
    spriteBase64,
  ] = $derived(mon);
  let [[type1Name, type1Base64], type1Idx] = $derived(type1);
  let [[type2Name, type2Base64], type2Idx] = $derived(type2);
  let [ability1Name, ability1Desc] = $derived(ability1);
  let [ability2Name, ability2Desc] = $derived(ability2);
  let [ability3Name, ability3Desc] = $derived(ability3);
  let bst = $derived(hp + atk + def + spA + spD + spd);
  let evYieldTexts = $derived(
    [
      `${(evYield & 3072) >> 10} HP`,
      `${(evYield & 768) >> 8} Attack`,
      `${(evYield & 192) >> 6} Defense`,
      `${(evYield & 48) >> 4} Sp. Atk`,
      `${(evYield & 12) >> 2} Sp. Def`,
      `${evYield & 3} Speed`,
    ].filter((text) => !text.startsWith("0"))
  );
  let [evoType, evoLine] = $derived(evoInfo);
  let iconURL = $derived(`${iconPngHeader}${iconBase64}`);
  let spriteURL = $derived(`${spritePngHeader}${spriteBase64}`);

  onMount(() => {
    cache.referrer = monURL;
    updateCache(["splits", "types"]);
    updateCache(["abilities", "moves"]);
    updateCache(["extracts"]);
  });

  let loadedURLs = $derived(Object.keys(cache.mons));
  let formsURLs = $derived(monURL ? forms.map(([_, url]) => url) : []);
  let requiredURLs = $derived(
    monURL
      ? [
          ...formsURLs,
          ...evoLine
            .map(([name, form]) => urlFromNameAndForm(name, form))
            .filter((url) => !formsURLs.includes(url)),
        ].filter((url) => !loadedURLs.includes(url))
      : []
  );

  $effect(() => {
    if (requiredURLs.length) {
      fetch(`/api?mons=${requiredURLs.join()}`).then((response) =>
        response.json().then((json) => {
          cache.mons = {
            ...cache.mons,
            ...json,
          };
        })
      );
    }
  });

  let showFormMenu = $state(false);
  let nameEl: HTMLElement | null = $state(null);
  function toggleFormMenu(event: MouseEvent) {
    showFormMenu = !showFormMenu;
  }

  const mdScreen = new MediaQuery("min-width: 396px");
  const lgScreen = new MediaQuery("min-width: 440px");
  let rootFontSize = $derived(lgScreen.current ? 20 : mdScreen.current ? 18 : 16);
  let headerFixed = $derived((scrollY.current ?? 0) > (monForm ? 6 : 4.5) * rootFontSize);

  let showSectionMenu = $state(false);
  function closeMenus() {
    showFormMenu = false;
    showSectionMenu = false;
  }

  const closeMenusOnScroll: Attachment = (element) => {
    document.addEventListener("scroll", closeMenus);
    return () => {
      document.removeEventListener("scroll", closeMenus);
    };
  };
</script>

<svelte:head>
  <meta name="theme-color" content="rgb(51,51,51)" />
</svelte:head>

<!-- Header -->
<row
  class={headerFixed
    ? "fixed z-2 w-full max-w-120 top-0 left-1/2 -translate-x-1/2 bg-[rgba(52,52,52,0.98)] shadow-[0_1px_5px_rgba(255,255,255,0.1)]"
    : "relative"}
  p="r-2"
  justify="between"
  items="center"
  overflow="visible"
>
  {@render SectionMenuButton()}
  {#if headerFixed}
    <button
      p="l-3"
      onclick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      <row items="center" gap="2">
        <h3>{monName}</h3>
        <div relative w="8" h="8" m="b-2">
          <img src={iconURL} alt={monURL} class="placed" />
        </div>
      </row>
    </button>
  {/if}
  {@render SearchButton()}
</row>

<!-- Top Section -->
<stack m="x-2" items="center" overflow="visible" class={headerFixed ? "m-t-10" : ""}>
  {#if forms.length}
    <row>
      <button z="2" onclick={toggleFormMenu}>
        <row bind:this={nameEl} relative p="x-3" items="center">
          <h1 wrap p="x-2" bg="hover:neutral-8 active:neutral-7">{monName}</h1>
          <h3 absolute style="left: calc(100% - 0.88rem)" c="neutral-4">▾</h3>
        </row>
      </button>
    </row>
  {:else}
    <h1 wrap>{monName}</h1>
  {/if}
  <div relative overflow="visible">
    {#if showFormMenu}
      {@render FormMenu()}
    {/if}
    {#if monForm}
      <p c="neutral-4">{monForm}</p>
    {/if}
  </div>
  <row m="y-2" gap="1.5">
    <div relative w="14.5" h="4.833333">
      <img src={`${typePngHeader}${type1Base64}`} alt={type1Name} class="placed" />
    </div>
    {#if type2Name}
      <div relative w="14.5" h="4.833333">
        <img src={`${typePngHeader}${type2Base64}`} alt={type2Name} class="placed" />
      </div>
    {/if}
  </row>
  <div m="t-2" p="3" b="neutral-6 1" rounded="xl" bg="neutral-8">
    <div relative w="22" h="22">
      <img src={spriteURL} alt={monURL} class="placed" />
    </div>
  </div>
</stack>

<h2 id="ability" m="t-4 x-4" c="neutral-2">Ability</h2>
<stack m="x-4" p="2" gap="2" bg="neutral-8" rounded="md">
  {@render AbilityRow(1, ability1Name, ability1Desc)}
  {@render AbilityRow(2, ability2Name, ability2Desc)}
  {#if ability3Name}
    {@render AbilityRow(3, ability3Name, ability3Desc)}
  {/if}
</stack>
{#snippet AbilityRow(index: number, name: string, desc: string)}
  <row gap="2">
    <div w="4.5">
      {#if index <= 2}
        <h3 font="medium">{index}.</h3>
      {:else}
        <h3 font="medium">&nbsp;•</h3>
      {/if}
    </div>
    <stack flex="initial">
      <row gap="2" items="end">
        <h3 font="medium">{name ? name : "--"}</h3>
        {#if index == 3}
          <p c="neutral-4">(hidden)</p>
        {/if}
      </row>
      <p c="neutral-4" wrap>{desc ? desc : "--"}</p>
    </stack>
  </row>
{/snippet}

<h2 id="stat" m="t-4 x-4" c="neutral-2">Base Stats</h2>
<stack m="x-4" p="2" gap="2" bg="neutral-8" rounded="md">
  <stack gap="1">
    <row class="stat-row">
      {@render Stat("HP", hp)}
      {@render Stat("Sp. Atk", spA)}
    </row>
    <row class="stat-row">
      {@render Stat("Attack", atk)}
      {@render Stat("Sp. Def", spD)}
    </row>
    <row class="stat-row">
      {@render Stat("Defense", def)}
      {@render Stat("Speed", spd)}
    </row>
  </stack>
  <h3 self="center" c="neutral-4" font="medium">Total&nbsp;&nbsp;{bst}</h3>
</stack>
{#snippet Stat(kind: string, stat: number)}
  <row class="w-27">
    <h3 flex="1" font="medium">{kind}</h3>
    {#if stat >= 120}
      <h3 class="c-green" align="right" font="bold">{stat}</h3>
    {:else if stat >= 90}
      <h3 class="c-green" align="right" font="medium">{stat}</h3>
    {:else if stat >= 60}
      <h3 class="c-yellow" align="right" font="medium">{stat}</h3>
    {:else if stat >= 30}
      <h3 class="c-red" align="right" font="medium">{stat}</h3>
    {:else}
      <h3 class="c-red" align="right" font="bold">{stat}</h3>
    {/if}
  </row>
{/snippet}

<h2 id="evolution" m="t-4 x-4" c="neutral-2">
  {evoType === 9 ? "Eevolution" : "Evolution"}
</h2>
<stack m="x-4" p="2" bg="neutral-8" rounded="md">
  {#if evoType === 0}
    <p p="x-2">None</p>
  {:else}
    <EvoChart current={monURL} {evoType} {evoLine} />
  {/if}
</stack>

<h2 id="other-info" m="t-4 x-4" c="neutral-2">Other Info</h2>
<stack m="x-4" p="x-2" bg="neutral-8" rounded="md">
  <row p="y-2" items="center">
    <p w="36" class="-m-l-4" font="semibold" align="center">Dex No.</p>
    <stack>
      <p>{nationalNo} <span c="neutral-4">(National)</span></p>
      {#if borriusNo}
        <p>{borriusNo} <span c="neutral-4">(Borrius)</span></p>
      {/if}
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2">
    <p w="36" class="-m-l-4" font="semibold" align="center">Catch Rate</p>
    <stack>
      <p>{catchRate}</p>
      <p c="neutral-4">
        ({(Math.pow(catchRate / 3 / 255, 0.75) * 100).toFixed(1)}% at full HP, 1x)
      </p>
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2" items="center">
    <p w="36" class="-m-l-4" font="semibold" align="center">Held items</p>
    <stack>
      {#if item1 && item1 == item2}
        <p>{item1} <span text="sm">(55%)</span></p>
      {:else if !item1 && !item2}
        <p>None</p>
      {:else}
        {#if item1}
          <p>{item1} <span text="sm">(50%)</span></p>
        {/if}
        {#if item2}
          <p>{item2} <span text="sm">(5%)</span></p>
        {/if}
      {/if}
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2" items="center">
    <p w="36" class="-m-l-4" font="semibold" align="center">Egg Group</p>
    <stack>
      <p>{eggGroup1}</p>
      {#if eggGroup2}
        <p>{eggGroup2}</p>
      {/if}
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2" items="center">
    <p w="36" class="-m-l-4" font="semibold" align="center">Gender Ratio</p>
    <stack>
      {#if genderRatio == -1}
        <p>Genderless</p>
      {:else}
        <p>{100 - genderRatio}% Male</p>
        <p>{genderRatio}% Female</p>
      {/if}
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2">
    <p w="36" class="-m-l-4" font="semibold" align="center">Egg Cycles</p>
    <stack>
      <p>{eggCycles}</p>
      <p c="neutral-4">
        ({(eggCycles * 257 - 256).toLocaleString()} to {(
          eggCycles * 257
        ).toLocaleString()} steps)
      </p>
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2">
    <p w="36" class="-m-l-4" font="semibold" align="center">Growth Rate</p>
    <stack>
      <p>{growthRate}</p>
      <p c="neutral-4">
        ({expByGrowthRate[growthRate].toLocaleString()} Exp to L100)
      </p>
    </stack>
  </row>
  <row b="t-1 neutral-5" p="y-2" items="center">
    <p w="36" class="-m-l-4" font="semibold" align="center">EV Yield</p>
    <stack>
      {#each evYieldTexts as text}
        <p>{text}</p>
      {/each}
    </stack>
  </row>
</stack>

<h2 id="learnset" m="t-4 x-4">Learnset</h2>
<stack m="x-4" p="x-1 y-2" rounded="md" bg="neutral-8">
  <h3 id="evo-move" align="center" font="semibold">By evolution</h3>
  {#if evoMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each evoMoves as move}
    {@render MoveRow(-1, move)}
  {/each}
  <h3 id="lvl-up" m="t-2" align="center" font="semibold">By leveling up</h3>
  {#if levelupMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each levelupMoves as move, idx}
    {@render MoveRow(levelupLevels[idx], move)}
  {/each}
  <h3 id="tm-hm" m="t-2" align="center" font="semibold">By TM / HM</h3>
  {#if tmMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each tmMoves as move}
    {@render MoveRow(0, move)}
  {/each}
  <h3 id="egg-move" m="t-2" align="center" font="semibold">By egg move</h3>
  {#if eggMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each eggMoves as move}
    {@render MoveRow(-1, move)}
  {/each}
  <h3 id="tutor-move" m="t-2" align="center" font="semibold">By tutor move</h3>
  {#if tutorMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each tutorMoves as move}
    {@render MoveRow(-1, move)}
  {/each}
</stack>

{#snippet MoveRow(tag: number, move: Move)}
  {@const [name, typeIdx, splitIdx, power, acc, tmHm] = move}
  {@const typeName = cache.types ? cache.types[typeIdx][0] : ""}
  {@const typeIcon = cache.types ? `${typePngHeader}${cache.types[typeIdx][1]}` : ""}
  {@const split = cache.splits ? cache.splits[splitIdx][0] : ""}
  {@const splitIcon = cache.splits ? `${splitPngHeader}${cache.splits[splitIdx][1]}` : ""}
  {@const stab =
    (typeIdx === type1Idx || typeIdx === type2Idx) &&
    split !== "status" &&
    !fixedMoves.includes(name)}
  <row p="y-2" b="b-1 neutral-5" justify="evenly" items="center">
    {#if tag > 0}
      <p w="7.5" align="right" text="[95%]">{tag}</p>
    {:else if tag === 0}
      {#if tmHm > 120}
        <p w="7.5" align="right" text="xs">HM{tmHm - 120}</p>
      {:else}
        <p w="7.5" align="right" text="[95%]">
          {tmHm.toString().padStart(3, "0")}
        </p>
      {/if}
    {:else}
      <div w="7.5"></div>
    {/if}
    <row w="30.5" m="l-2.5" gap="1" items="center">
      <p text="[95%]">{name}</p>
      <p c="neutral-4" text="sm">{stab ? "+" : ""}</p>
    </row>
    <row w="20.5" justify="between">
      <div relative w="12.5" h="4.166667">
        {#if typeName}
          <img src={typeIcon} alt={typeName} class="placed" />
        {/if}
      </div>
      <div relative w="7.5" h="3.991228">
        {#if split}
          <img src={splitIcon} alt={split} class="placed" />
        {/if}
      </div>
    </row>
    <p w="8" text="[95%]" align="center">{power > 1 ? power : "--"}</p>
    <p w="8" c="neutral-4" text="xs" align="center">
      {acc ? acc + "%" : " -- "}
    </p>
  </row>
{/snippet}

<!--Menu Items-->
{#snippet MenuOverlay()}
  <button
    z="1"
    fixed
    top="0"
    left="0"
    w="screen"
    h="screen"
    cursor="default"
    aria-label="outside"
    onclick={closeMenus}
    {@attach closeMenusOnScroll}
  ></button>
{/snippet}

{#if showFormMenu || showSectionMenu}
  {@render MenuOverlay()}
{/if}

{#snippet SectionMenuButton()}
  <row relative overflow="visible">
    <button
      bg="hover:neutral-7 active:neutral-6"
      aria-label="sections"
      ontouchstart={() => {}}
      onclick={() => {
        showSectionMenu = !showSectionMenu;
      }}
    >
      <row w="10" h="10" items="center" justify="center">
        <icon:list-bullet></icon:list-bullet>
      </row>
    </button>
    {#if showSectionMenu}
      {@render SectionMenu()}
    {/if}
  </row>
{/snippet}

{#snippet SectionMenu()}
  <stack
    absolute
    z="3"
    top="10"
    left="0"
    p="2"
    bg="[rgb(52,52,52)]"
    shadow="[1px_1px_15px_rgba(38,38,38)]"
  >
    {@render MenuButton("Ability", "#ability")}
    {@render MenuButton("Base Stats", "#stat")}
    {@render MenuButton("Evolution", "#evolution")}
    {@render MenuButton("Other Info", "#other-info")}
    {@render MenuButton("Learnset", "#learnset")}
    <div m="y-0.5" b="t-1 neutral-5"></div>
    {@render MenuButton("evolution", "#evo-move", "sm")}
    {@render MenuButton("leveling up", "#lvl-up", "sm")}
    {@render MenuButton("TM / HM", "#tm-hm", "sm")}
    {@render MenuButton("egg move", "#egg-move", "sm")}
    {@render MenuButton("tutor move", "#tutor-move", "sm")}
  </stack>
{/snippet}

{#snippet SearchButton()}
  <a href="/" bg="hover:neutral-7 active:neutral-6" aria-label="back">
    <row w="10" h="10" items="center" justify="center">
      <icon:magnifying-glass></icon:magnifying-glass>
    </row>
  </a>
{/snippet}

<!-- Form Menu -->
{#snippet FormMenu()}
  <stack
    absolute
    z="2"
    top="0"
    left="1/2"
    translate="x-[-50%]"
    w="max"
    p="2"
    bg="neutral-8"
    shadow="[1px_1px_15px_rgba(30,30,30)]"
  >
    {#if forms.length <= 10}
      {@render FormMenuStack(forms)}
    {:else if forms.length <= 20}
      <row gap="4">
        {@render FormMenuStack(forms.slice(0, (forms.length + 1) / 2))}
        {@render FormMenuStack(forms.slice((forms.length + 1) / 2))}
      </row>
    {:else}
      {@const first = Math.floor((forms.length + 2) / 3)}
      {@const second = Math.floor((forms.length + 1) / 3)}
      <row gap="4">
        {@render FormMenuStack(forms.slice(0, first))}
        {@render FormMenuStack(forms.slice(first, first + second))}
        {@render FormMenuStack(forms.slice(first + second))}
      </row>
    {/if}
  </stack>
{/snippet}

{#snippet FormMenuStack(forms: [string, string][])}
  <stack>
    {#each forms as [label, url]}
      {@render FormMenuButton(label, url)}
    {/each}
  </stack>
{/snippet}

{#snippet FormMenuButton(label: string, url: string)}
  {#if url === monURL}
    <h3 p="1" c="neutral-5" text="center" font="medium" cursor="default">{label}</h3>
  {:else}
    {@render MenuButton(label, url)}
  {/if}
{/snippet}

{#snippet MenuButton(label: string, url: string, size: string = "")}
  <button
    bg="hover:neutral-7 active:neutral-6"
    onclick={() => {
      closeMenus();
      goto(url);
    }}
  >
    {#if size === "sm"}
      <p p="1">{label}</p>
    {:else}
      <h3 p="1">{label}</h3>
    {/if}
  </button>
{/snippet}

<style>
  .stat-row {
    justify-content: space-around;
  }
  @media (min-width: 500px) {
    .stat-row {
      justify-content: space-evenly;
    }
  }
</style>

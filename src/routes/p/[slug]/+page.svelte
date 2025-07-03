<script lang="ts">
  import type { PageProps } from "./$types";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { scrollY } from "svelte/reactivity/window";
  import { MediaQuery } from "svelte/reactivity";
  import type { Attachment } from "svelte/attachments";

  import EvoChart from "./EvoChart.svelte";
  import { urlFromNameAndForm, spriteFromUrl, iconFromUrl } from "$lib";

  let { data }: PageProps = $props();
  let { types } = data;
  let query = page.state.query ?? "";
  let [
    monName,
    monForm,
    forms,
    type1idx,
    type2idx,
    ability1Name,
    ability1Desc,
    ability2Name,
    ability2Desc,
    ability3Name,
    ability3Desc,
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
    levelupMoves,
    tmMoves,
    eggMoves,
    tutorMoves,
  ] = $derived(data.info);
  let type1Name = $derived(types[type1idx]);
  let type2Name = $derived(type2idx == -1 ? "" : types[type2idx]);
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

  let monURL = $derived(urlFromNameAndForm(monName, monForm));
  let spriteURL = $derived(spriteFromUrl(monURL));
  let iconURL = $derived(iconFromUrl(monURL));

  let showFormMenu = $state(false);
  let nameEl: HTMLElement | null = $state(null);
  function toggleFormMenu(event: MouseEvent) {
    showFormMenu = !showFormMenu;
  }

  const mdScreen = new MediaQuery("min-width: 396px");
  const lgScreen = new MediaQuery("min-width: 440px");
  let rootFontSize = $derived(lgScreen.current ? 20 : mdScreen.current ? 18 : 16);
  let headerFixed = $derived((scrollY.current ?? 0) > (monForm ? 13 : 12) * rootFontSize);

  let showJumpMenu = $state(false);
  function closeMenus() {
    showFormMenu = false;
    showJumpMenu = false;
  }

  const closeMenusOnScroll: Attachment = (element) => {
    document.addEventListener("scroll", closeMenus);
    return () => {
      document.removeEventListener("scroll", closeMenus);
    };
  };

  const expByGrowthRate = {
    Erratic: 600_000,
    Fast: 800_000,
    "Medium Fast": 1_000_000,
    "Medium Slow": 1_059_860,
    Slow: 1_250_000,
    Fluctuating: 1_640_000,
  };

  const fixedMoves = [
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
</script>

<svelte:head>
  <meta name="theme-color" content="rgb(51,51,51)" />
</svelte:head>

<!-- Normal Header -->
<button
  bg="hover:neutral-8 active:neutral-7"
  ontouchstart={() => {}}
  onclick={() => {
    goto("/", { state: { query } });
  }}
  aria-label="back"
>
  <row w="10" h="10" items="center" justify="center">
    <icon:arrow-left></icon:arrow-left>
  </row>
</button>

<!-- Top Section -->
<stack m="x-2" items="center" overflow="visible">
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
      <img src="/types/{type1Name}.png" alt={type1Name} class="placed" />
    </div>
    {#if type2Name}
      <div relative w="14.5" h="4.833333">
        <img src="/types/{type2Name}.png" alt={type2Name} w="14.5" />
      </div>
    {/if}
  </row>
  <div m="t-2" p="3" b="neutral-6 1" rounded="xl" bg="neutral-8">
    <div relative w="22" h="22">
      <img src="/sprites/{spriteURL}.png" alt={monURL} class="placed" />
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
        <h3 font="medium">•</h3>
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
  <row w="27">
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
    <EvoChart {evoType} {evoLine} />
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
    {@render MoveRow([0, ...move], false)}
  {/each}
  <h3 id="lvl-up" m="t-2" align="center" font="semibold">By leveling up</h3>
  {#if levelupMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each levelupMoves as move}
    {@render MoveRow(move, false)}
  {/each}
  <h3 id="tm-hm" m="t-2" align="center" font="semibold">By TM / HM</h3>
  {#if tmMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each tmMoves as move}
    {@render MoveRow(move, true)}
  {/each}
  <h3 id="egg-move" m="t-2" align="center" font="semibold">By egg move</h3>
  {#if eggMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each eggMoves as move}
    {@render MoveRow([0, ...move], false)}
  {/each}
  <h3 id="tutor-move" m="t-2" align="center" font="semibold">By tutor move</h3>
  {#if tutorMoves.length == 0}
    <p p="y-1" c="neutral-2" align="center" b="b-1 neutral-5">None</p>
  {/if}
  {#each tutorMoves as move}
    {@render MoveRow([0, ...move], false)}
  {/each}
</stack>
{#snippet MoveRow(move: [number, string, number, number, number, number], tm: boolean)}
  {@const [label, name, typeIdx, splitIdx, power, acc] = move}
  {@const typeName = types[typeIdx]}
  {@const split = ["physical", "special", "status"][splitIdx]}
  {@const stab =
    (typeIdx === type1idx || typeIdx === type2idx) &&
    split !== "status" &&
    !fixedMoves.includes(name)}
  <row p="y-2" b="b-1 neutral-5" justify="evenly" items="center">
    {#if tm}
      {#if label > 120}
        <p w="7.5" align="right" text="xs">HM{label - 120}</p>
      {:else}
        <p w="7.5" align="right" text="[95%]">
          {label.toString().padStart(3, "0")}
        </p>
      {/if}
    {:else}
      <p w="7.5" align="right" text="[95%]">{label ? label : ""}</p>
    {/if}
    <row w="30.5" m="l-2.5" gap="1" items="center">
      <p text="[95%]">{name}</p>
      <p c="neutral-4" text="sm">{stab ? "+" : ""}</p>
    </row>
    <row w="20.5" justify="between">
      <img src="/types/{typeName}.png" alt={typeName} w="12.5" />
      <img src="/types/{split}.png" alt={split} w="7.5" />
    </row>
    <p w="8" text="[95%]" align="center">{power > 1 ? power : "--"}</p>
    <p w="8" c="neutral-4" text="xs" align="center">
      {acc ? acc + "%" : " -- "}
    </p>
  </row>
{/snippet}

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

{#if showFormMenu || (showJumpMenu && headerFixed)}
  {@render MenuOverlay()}
{/if}

<!-- Fixed Header -->
{#if headerFixed}
  <row
    z="2"
    fixed
    w="full"
    max-w="120"
    top="0"
    left="1/2"
    translate="x-[-50%]"
    bg="[rgba(52,52,52,0.98)]"
    shadow="[0_1px_5px_rgba(255,255,255,0.1)]"
    justify="between"
    items="center"
    overflow="visible"
  >
    <row
      ><button
        bg="hover:neutral-7 active:neutral-6"
        ontouchstart={() => {}}
        onclick={() => {
          goto("/", { state: { query } });
        }}
        aria-label="back"
      >
        <row w="10" h="10" items="center" justify="center">
          <icon:chevron-left></icon:chevron-left>
        </row>
      </button>
      <div w="2"></div>
    </row>
    <button
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
          <img src="/icons/{iconURL}.png" alt={monURL} class="placed" />
        </div>
      </row>
    </button>
    <row relative overflow="visible">
      <button
        bg="hover:neutral-7 active:neutral-6"
        aria-label="jump"
        ontouchstart={() => {}}
        onclick={() => {
          showJumpMenu = !showJumpMenu;
        }}
      >
        <row w="10" h="10" items="center" justify="center">
          <icon:list-bullet></icon:list-bullet>
        </row>
      </button>
      <div w="2">&nbsp;</div>
      {#if showJumpMenu}
        {@render JumpMenu()}
      {/if}
    </row>
  </row>
{/if}

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
      <stack>
        {#each forms as [label, url]}
          {@render FormMenuButton(label, url)}
        {/each}
      </stack>
    {:else}
      <row gap="4">
        <stack>
          {#each forms.slice(0, (forms.length + 1) / 2) as [label, url]}
            {@render FormMenuButton(label, url)}
          {/each}
        </stack>
        <stack>
          {#each forms.slice((forms.length + 1) / 2) as [label, url]}
            {@render FormMenuButton(label, url)}
          {/each}
        </stack>
      </row>
    {/if}
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
      goto(url, { replaceState: true });
    }}
  >
    {#if size === "sm"}
      <p p="1">{label}</p>
    {:else}
      <h3 p="1">{label}</h3>
    {/if}
  </button>
{/snippet}

{#snippet JumpMenu()}
  <stack
    absolute
    z="2"
    top="10"
    left="-19"
    p="2"
    bg="[rgb(52,52,52)]"
    shadow="[1px_1px_15px_rgba(38,38,38)]"
  >
    {@render MenuButton("Ability", "#ability")}
    {@render MenuButton("Base Stats", "#stat")}
    {@render MenuButton("Evolution", "#evolution")}
    {@render MenuButton("Other Info", "#other-info")}
    {@render MenuButton("Learnset", "#learnset")}
    <div b="t-1 neutral-5"></div>
    {@render MenuButton("evolution", "#evo-move", "sm")}
    {@render MenuButton("leveling up", "#lvl-up", "sm")}
    {@render MenuButton("TM / HM", "#tm-hm", "sm")}
    {@render MenuButton("egg move", "#egg-move", "sm")}
    {@render MenuButton("tutor move", "#tutor-move", "sm")}
  </stack>
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

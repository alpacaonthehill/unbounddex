<script lang="ts">
  type Props = {
    current: string;
    evoType: number;
    evoLine: [string, string, string][];
  };
  let { current, evoType, evoLine }: Props = $props();
  import { goto } from "$app/navigation";

  import { cache } from "$lib/cache.svelte";
  import { urlFromNameAndForm, spritePngHeader } from "$lib";
</script>

{#snippet EvoItem([name, form, method]: [string, string, string])}
  {@const url = urlFromNameAndForm(name, form)}
  {@const disabled = current === url}
  <button
    flex="initial"
    {disabled}
    class={disabled ? "" : "hover:bg-neutral-7 active:bg-neutral-6"}
    ontouchstart={() => {}}
    onclick={() => {
      goto(url);
    }}
  >
    <stack items="center">
      <div relative w="16" h="16">
        {#if url in cache.mons}
          <img
            src={`${spritePngHeader}${cache.mons[url][33]}`}
            alt={name}
            class="placed"
          />
        {/if}
      </div>
      <p wrap="break" align="center">{name}</p>
      {#if form}
        <p wrap align="center" c="neutral-4" text="sm">{form}</p>
      {/if}
      {#if method}
        <p wrap align="center" c="blue-3" text="sm">{method}</p>
      {/if}
    </stack>
  </button>
{/snippet}

{#if evoType == 1}
  <row items="start" justify="center" gap="4">
    <div flex="initial" max-w="1/2">{@render EvoItem(evoLine[0])}</div>
    <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
    <div flex="initial" max-w="1/2">{@render EvoItem(evoLine[1])}</div>
  </row>
{:else if evoType == 2}
  <row items="start" justify="evenly">
    <row flex="auto" max-w="1/3" justify="evenly">{@render EvoItem(evoLine[0])}</row>
    <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
    <row flex="auto" max-w="1/3" justify="evenly">{@render EvoItem(evoLine[1])}</row>
    <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
    <row flex="auto" max-w="1/3" justify="evenly">{@render EvoItem(evoLine[2])}</row>
  </row>
{:else if evoType == 3}
  <row items="center" justify="center" gap="4">
    <row flex="initial" max-w="1/2">{@render EvoItem(evoLine[0])}</row>
    <stack class="-m-t-5.5" gap="16">
      <icon:arrow-up-right w="5"></icon:arrow-up-right>
      <icon:arrow-down-right w="5"></icon:arrow-down-right>
    </stack>
    <stack flex="initial" max-w="1/2" gap="6">
      {@render EvoItem(evoLine[1])}
      {@render EvoItem(evoLine[2])}
    </stack>
  </row>
{:else if evoType == 4}
  <row items="center" justify="evenly" gap="1">
    <row flex="auto" max-w="2/3" justify="evenly" items="start" gap="1">
      <row flex="auto" max-w="1/2" justify="evenly">{@render EvoItem(evoLine[0])}</row>
      <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
      <row flex="auto" max-w="1/2" justify="evenly">{@render EvoItem(evoLine[1])}</row>
    </row>
    <stack class="-m-t-11" gap="16">
      <icon:arrow-up-right w="5"></icon:arrow-up-right>
      <icon:arrow-down-right w="5"></icon:arrow-down-right>
    </stack>
    <stack flex="auto" max-w="1/3" gap="6">
      {@render EvoItem(evoLine[2])}
      {@render EvoItem(evoLine[3])}
    </stack>
  </row>
{:else if evoType == 5}
  <row items="center" justify="evenly" gap="1">
    <div flex="initial" max-w="1/3">{@render EvoItem(evoLine[0])}</div>
    <stack class="-m-t-5.5" gap="12">
      <icon:arrow-up-right w="5"></icon:arrow-up-right>
      <icon:arrow-down-right w="5"></icon:arrow-down-right>
    </stack>
    <stack flex="initial" max-w="2/3" gap="6">
      <row flex="auto" justify="evenly" items="start" gap="1">
        <row flex="1" justify="evenly">{@render EvoItem(evoLine[1])}</row>
        {#if evoLine[3][0]}
          <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
          <row flex="1" justify="evenly">{@render EvoItem(evoLine[3])}</row>
        {:else}
          <div w="5"></div>
          <div flex="1"></div>
        {/if}
      </row>
      <row flex="auto" justify="evenly" items="start" gap="1">
        <row flex="1" justify="evenly">{@render EvoItem(evoLine[2])}</row>
        <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
        <row flex="1" justify="evenly">{@render EvoItem(evoLine[4])}</row>
      </row>
    </stack>
  </row>
{:else if evoType == 6}
  <row items="center" justify="evenly" gap="1">
    <div flex="initial" max-w="1/2">{@render EvoItem(evoLine[0])}</div>
    <stack m="t-[-12px]" gap="12">
      <icon:arrow-up-right w="5"></icon:arrow-up-right>
      <icon:arrow-right w="5"></icon:arrow-right>
      <icon:arrow-down-right w="5"></icon:arrow-down-right>
    </stack>
    <stack flex="initial" max-w="1/2" gap="4">
      {@render EvoItem(evoLine[1])}
      {@render EvoItem(evoLine[2])}
      {@render EvoItem(evoLine[3])}
    </stack>
  </row>
{:else if evoType == 7}
  <stack gap="2">
    <row items="start">
      <div flex="1"></div>
      <icon:arrow-down-left m="t-11" w="5"></icon:arrow-down-left>
      <row flex="1" justify="center">{@render EvoItem(evoLine[0])}</row>
      <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
      <row flex="1" justify="center">{@render EvoItem(evoLine[4])}</row>
    </row>
    <row items="start">
      <row flex="1" justify="center">{@render EvoItem(evoLine[3])}</row>
      <icon:arrow-left m="t-5.5" w="5"></icon:arrow-left>
      <row flex="1" justify="center">{@render EvoItem(evoLine[1])}</row>
      <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
      <row flex="1" justify="center">{@render EvoItem(evoLine[5])}</row>
    </row>
    <row items="start">
      <div flex="1"></div>
      <icon:arrow-up-left w="5"></icon:arrow-up-left>
      <row flex="1" justify="center">{@render EvoItem(evoLine[2])}</row>
      <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
      <row flex="1" justify="center">{@render EvoItem(evoLine[6])}</row>
    </row>
  </stack>
{:else if evoType == 8}
  <stack>
    <row items="end" gap="5">
      <row flex="1" justify="center">{@render EvoItem(evoLine[4])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[5])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[6])}</row>
    </row>
    <row self="center" gap="10">
      <icon:arrow-up-left w="5"></icon:arrow-up-left>
      <icon:arrow-up w="5"></icon:arrow-up>
      <icon:arrow-up-right w="5"></icon:arrow-up-right>
    </row>
    <row items="center">
      <row flex="1" justify="center">{@render EvoItem(evoLine[3])}</row>
      <icon:arrow-left m="t-5.5" w="5"></icon:arrow-left>
      <row flex="1" justify="center">{@render EvoItem(evoLine[0])}</row>
      <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
      <row flex="1" justify="center">{@render EvoItem(evoLine[7])}</row>
    </row>
    <row self="center" gap="10">
      <icon:arrow-down-left w="5"></icon:arrow-down-left>
      <icon:arrow-down-right w="5"></icon:arrow-down-right>
    </row>
    <row items="start" gap="5">
      <row flex="1" justify="center">{@render EvoItem(evoLine[2])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[1])}</row>
    </row>
  </stack>
{:else if evoType == 9}
  <stack>
    <row items="end" gap="5">
      <row flex="1" justify="center">{@render EvoItem(evoLine[1])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[2])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[3])}</row>
    </row>
    <row self="center" gap="12">
      <icon:arrow-up-left w="5"></icon:arrow-up-left>
      <icon:arrow-up w="5"></icon:arrow-up>
      <icon:arrow-up-right w="5"></icon:arrow-up-right>
    </row>
    <row items="center">
      <row flex="1" justify="center">{@render EvoItem(evoLine[4])}</row>
      <icon:arrow-left m="t-5.5" w="5"></icon:arrow-left>
      <row flex="1" justify="center">{@render EvoItem(evoLine[0])}</row>
      <icon:arrow-right m="t-5.5" w="5"></icon:arrow-right>
      <row flex="1" justify="center">{@render EvoItem(evoLine[5])}</row>
    </row>
    <row self="center" gap="12">
      <icon:arrow-down-left w="5"></icon:arrow-down-left>
      <icon:arrow-down w="5"></icon:arrow-down>
      <icon:arrow-down-right w="5"></icon:arrow-down-right>
    </row>
    <row items="start" gap="5">
      <row flex="1" justify="center">{@render EvoItem(evoLine[6])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[7])}</row>
      <row flex="1" justify="center">{@render EvoItem(evoLine[8])}</row>
    </row>
  </stack>
{/if}

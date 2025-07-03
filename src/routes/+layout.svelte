<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import "../app.css";

  import { page } from "$app/state";
  let { children } = $props();
  let isError = $derived(page.error !== null);
</script>

<div
  min-w="100%"
  min-h="100%"
  bg={page.url.pathname.startsWith("/p/") || isError ? "neutral-9" : "[rgb(51,51,51)]"}
  c="neutral-1"
>
  <div max-w="[30rem]" min-h="100%" m="0 auto">
    {@render children()}
  </div>
</div>

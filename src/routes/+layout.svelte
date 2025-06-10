<script lang="ts">
  import "@unocss/reset/tailwind.css";
  import "uno.css";
  import "../app.css";

  let { children } = $props();
</script>

<div w="100%" h="100%" bg="neutral-8" p="2">
  {@render children()}
</div>

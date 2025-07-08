<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<svelte:head>
  <meta name="theme-color" content="rgb(23,23,23)" />
</svelte:head>

<div class="error-pic" relative h="0">
  <img src="/error.png" alt="Error" class="placed" />
</div>

<h3 w="2/3" m="0 auto" wrap align="center" c="neutral-4" font="medium">
  The page you are looking for does not exist, or there is a problem at our end.
</h3>

<button
  block
  m="t-7 x-auto"
  p="x-2"
  bg="hover:neutral-8 active:neutral-7"
  ontouchstart={() => {}}
  onclick={() => {
    goto("/");
  }}
  aria-label="home"
>
  <h2 underline>Return to home</h2>
</button>

<style>
  .error-pic {
    width: 25%;
    padding-top: 25%;
    margin-top: 5vh;
    margin-left: auto;
    margin-right: auto;
  }
  @media (min-height: 400px) {
    .error-pic {
      width: 50%;
      padding-top: 50%;
      margin-top: 10vh;
    }
  }
</style>

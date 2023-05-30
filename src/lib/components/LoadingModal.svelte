<script lang="ts">
  import Spinner from "./Spinner.svelte";
  import { modalMessage, modalVisible } from "../store/store";
  import { onDestroy } from "svelte";

  let visible;
  const unsubscribe = modalVisible.subscribe((val) => {
    visible = val;
  });
  onDestroy(unsubscribe);
</script>

<div
  class="modal fixed top-0 z-50 box-border hidden h-screen w-screen"
  class:visible
/>
<div
  class="wrapper fixed top-0 z-50 box-border hidden h-screen w-screen bg-white"
  class:visible
>
  <div
    class="loadingCard mx-auto my-[45vh] box-border flex h-[6rem] w-[25vw] min-w-[15rem] items-center justify-center gap-4 rounded-xl font-medium text-zinc-900"
  >
    <Spinner /> &ensp; {$modalMessage}
  </div>
</div>

<style>
  /* .wrapper,
  .modal {
    display: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    top: 0;
    z-index: 1000;
  }
  .modal {
    opacity: 0.7;
    background-color: black;
  } */
  /* .loadingCard {
    display: none;
    gap: 1rem;
    min-width: 15rem;
    width: 25vw;
    height: 6rem;
    margin: 45vh auto;
    padding: 2.5rem;
    box-sizing: border-box;
    border-radius: 1rem;
    font-weight: bold;
  } */
  .visible {
    display: block !important;
  }
  /* .center {
    gap: 1rem;
  } */
</style>

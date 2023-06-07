<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";

  import initializeSocket from "./lib/utilities/initializeSocket";
  import { getWorkingURL, setDeviceInfo } from "./lib/utilities/misc";

  import {
    settingsPageOpen,
    historyPageOpen,
  } from "./lib/store/store";
  import LoadingModal from "./lib/components/LoadingModal.svelte";
  import Setting from "./lib/components/Setting.svelte";
  import { onMount } from "svelte";
  import Home from "./lib/components/Home.svelte";
  import History from "./lib/components/History.svelte";
  import ReceivedTextModal from "./lib/components/ReceivedTextModal.svelte";

  onMount(async () => {
    let URL = await getWorkingURL();
    initializeSocket(URL);
    setDeviceInfo();
  });
</script>

<main class="relative h-screen w-screen overflow-hidden lg:flex text-gray-900">
  {#if $historyPageOpen}
    <History />
  {:else if $settingsPageOpen}
    <Setting />
  {:else}
    <Home />
  {/if}
</main>
<SvelteToast />
<LoadingModal />
<ReceivedTextModal />

<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";

  import FileSelector from "./lib/components/FileSelector.svelte";
  import Progress from "./lib/components/Progress.svelte";
  import initializeSocket from "./lib/utilities/initializeSocket";
  import { setDeviceInfo } from "./lib/utilities/misc";

  import { selectedFiles, settingsVisible } from "./lib/store/store";
  import Devices from "./lib/components/Devices.svelte";
  import LoadingModal from "./lib/components/LoadingModal.svelte";
  import Setting from "./lib/components/Setting.svelte";
  import { onMount } from "svelte";

  onMount(async () => {
    let URL = localStorage.getItem("url");
    if (!URL) URL = "https://waterdrop-server.glitch.me";
    
    initializeSocket(URL);
    setDeviceInfo();
  });
  const openSettings = () => {
    settingsVisible.set(true);
  };
</script>

<main class="relative h-screen w-screen overflow-hidden lg:flex">
  <div
    on:click={openSettings}
    on:keypress={openSettings}
    class="icon absolute right-6 top-8 z-[100] cursor-pointer justify-center opacity-0 transition-all hover:opacity-100"
  >
    <span class="material-symbols-rounded text-3xl"> settings </span>
  </div>
  {#if $selectedFiles.length}
    <Devices />
  {:else}
    <FileSelector />
  {/if}
  <Progress />
</main>
<SvelteToast />
<LoadingModal />
{#if $settingsVisible}
  <Setting />
{/if}

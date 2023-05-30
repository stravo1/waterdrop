<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";

  import FileSelector from "./lib/components/FileSelector.svelte";
  import Progress from "./lib/components/Progress.svelte";
  import initializeSocket from "./lib/utilities/initializeSocket";
  import { setDeviceInfo } from "./lib/utilities/misc";

  import { selectedFiles } from "./lib/store/store";
  import Devices from "./lib/components/Devices.svelte";
  import LoadingModal from "./lib/components/LoadingModal.svelte";

  let URL = "http://192.168.247.244:8080/";
  // let URL = "http://192.168.49.168:8080/";
  initializeSocket(URL);

  setDeviceInfo();
</script>

<main class="h-screen w-screen overflow-hidden">
  {#if $selectedFiles.length}
    <Devices />
  {:else}
    <FileSelector />
  {/if}
  <Progress />
</main>
<SvelteToast />
<LoadingModal />

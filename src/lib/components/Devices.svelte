<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { selectedFiles, connectedDevices } from "../store/store";
  import DeviceListCard from "./DeviceListCard.svelte";

  const deselect = () => {
    selectedFiles.set([]);
  };
</script>

<div
  in:fade={{ duration: 150 }}
  out:fly={{ y: -250, duration: 200 }}
  class="relative flex h-screen w-screen flex-col"
>
  <div
    on:click={deselect}
    on:keypress={deselect}
    class="down-icon absolute top-6 ml-4 cursor-pointer"
  >
    <span class="material-symbols-rounded text-[2rem]"> arrow_back </span>
  </div>
  <div class="mt-14 h-[90%] w-full overflow-scroll">
    <div class="progress-wrapper flex min-h-[13rem] w-full flex-col p-8">
      <h1 class="mb-6 text-3xl font-semibold">nearby devices</h1>
      {#if [...$connectedDevices.keys()].length}
        {#each [...$connectedDevices.values()] as device}
          <DeviceListCard
            deviceType={device.deviceType}
            name={device.name}
            platform={device.platform}
          />
        {/each}
      {:else}
        <div class="flex w-full justify-center mt-4">
          No nearby devices available :&#40;
        </div>
      {/if}
    </div>
    <!-- <div class="progress-wrapper flex min-h-[13rem] w-full p-8">
        <h1 class="text-3xl font-semibold">receiving</h1>
      </div> -->
  </div>
</div>

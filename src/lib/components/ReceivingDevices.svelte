<script>
  import { connectedDevices } from "../store/store";
  import DeviceListCard from "./DeviceListCard.svelte";
</script>

<div
  class="relative flex w-full shrink-0 grow-0 basis-full flex-wrap rounded-t-2xl p-6 pt-8 lg:w-32 lg:rounded-b-2xl lg:pb-6"
>
  <h1 class="absolute top-4 font-medium">Send to</h1>
  {#if [...$connectedDevices.keys()].length}
    {#each [...$connectedDevices.entries()] as device}
      <DeviceListCard
        deviceType={device[1].deviceType}
        name={device[1].name}
        id={device[0]}
      />
    {/each}
  {:else}
    <div class="w-full pt-10 text-center lg:text-left lg:text-lg">
      No nearby devices :&#40;
    </div>
  {/if}
</div>

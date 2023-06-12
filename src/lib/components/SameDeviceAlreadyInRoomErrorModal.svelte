<script lang="ts">
  import ClipboardJS from "clipboard/dist/clipboard.min.js";

  import { sameDeviceAlreadyInRoomErrorModalVisible } from "../store/store";
  import { onDestroy, onMount } from "svelte";
  import { showToast } from "../utilities/misc";
  import initializeSocket from "../utilities/initializeSocket";

  let visible: boolean;
  const unsubscribe = sameDeviceAlreadyInRoomErrorModalVisible.subscribe(
    (val) => {
      visible = val;
    }
  );

  const connectAnyways = () => {
    initializeSocket("forced");
    sameDeviceAlreadyInRoomErrorModalVisible.set(false);
  };
  onDestroy(unsubscribe);
</script>

<div
  class="modal fixed top-0 z-50 box-border hidden h-screen w-screen bg-white"
  class:visible
/>
<div
  class="wrapper fixed top-0 z-50 box-border hidden h-screen w-screen items-center justify-center"
  class:visible
>
  <div class="m-4 block w-72 overflow-hidden rounded-xl bg-white p-6 lg:w-96">
    <h5 class="mb-2 text-2xl lg:text-xl font-medium">
        Oops!</h5>
    <p id="content" class="line-clamp-6 text-sm font-normal text-gray-700">
      A device with the same name is already connected to WaterDrop!
    </p>
    <div class="mt-4 flex w-full justify-end gap-2">
      <button
        data-clipboard-target="#content"
        class="copy-button mt-2 w-full rounded-lg bg-rose-500 p-2 px-4 font-medium text-white"
        on:click={connectAnyways}>Connect Anyways</button
      >
    </div>
  </div>
</div>

<style>
  .visible {
    display: flex !important;
  }
</style>

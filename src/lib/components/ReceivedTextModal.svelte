<script lang="ts">
  import ClipboardJS from "clipboard/dist/clipboard.min.js";

  import {
    receivedTextModalContent,
    receivedTextModalVisible,
  } from "../store/store";
  import { onDestroy, onMount } from "svelte";
  import { showToast } from "../utilities/misc";

  let visible: boolean;
  const unsubscribe = receivedTextModalVisible.subscribe((val) => {
    visible = val;
  });
  onMount(() => {
    new ClipboardJS(".copy-button");
  });
  onDestroy(unsubscribe);
  const close = () => {
    receivedTextModalVisible.set(false);
  };
</script>

<div
  class="modal fixed top-0 z-50 box-border hidden h-screen w-screen bg-black opacity-50"
  class:visible
/>
<div
  class="wrapper fixed top-0 z-50 box-border hidden h-screen w-screen items-center justify-center"
  class:visible
>
  <div
    class="m-4 block w-72 lg:w-96 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow"
  >
    <h5 class="mb-2 text-xl font-medium">
      {$receivedTextModalContent.name} sent:
    </h5>
    <p id="content" class="line-clamp-6 text-sm font-normal text-gray-700">
      {$receivedTextModalContent.text}
    </p>
    <div class="mt-4 flex w-full justify-end gap-2">
      <button on:click={close} class="p-2 px-4 font-medium text-gray-400"
        >Close</button
      >
      <button
        data-clipboard-target="#content"
        class="copy-button rounded-full bg-sky-500 p-2 px-4 font-medium text-white"
        on:click={() => showToast("Copied", "success")}>Copy</button
      >
    </div>
  </div>
</div>

<style>
  .visible {
    display: flex !important;
  }
</style>

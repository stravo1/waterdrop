<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    historyPageOpen,
    selectedFiles,
    settingsPageOpen,
    sheetVisible,
    textInput,
  } from "../store/store";
  import { showToast } from "../utilities/misc";
  import SendingSheet from "./SendingSheet.svelte";

  let unsubVisible;
  let visible;
  unsubVisible = sheetVisible.subscribe((arg) => {
    visible = arg;
  });

  const openSheet = () => {
    sheetVisible.set(true);
  };
  const closeSheet = () => {
    sheetVisible.set(false);
    selectedFiles.set([]);
    textInput.set("");
  };

  const openSettings = (ev: Event) => {
    ev.stopPropagation();
    settingsPageOpen.set(true);
  };
  const openHistory = (ev: Event) => {
    ev.stopPropagation();
    historyPageOpen.set(true);
  };

  const drop = (ev: DragEvent) => {
    let files: File[] = [];
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          files.push(file);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        files.push(file);
      });
    }
    showToast(`${files.length} file(s) selected!`);
    selectedFiles.set(files);
    openSheet();
  };
  const drag = (ev: DragEvent) => {
    ev.preventDefault();
  };
</script>

<div
  on:drop={drop}
  on:dragover={drag}
  class="flex w-screen flex-col items-center justify-center"
>
  <div
    on:click={openHistory}
    on:keypress={openHistory}
    class="icon mb-6 flex w-full justify-end gap-4 pr-3 pt-4 lg:cursor-pointer lg:pr-8 lg:pt-6"
  >
    <span class="material-symbols-rounded text-2xl"> history </span>
    <span
      class="material-symbols-rounded text-2xl"
      on:click={openSettings}
      on:keypress={openSettings}
    >
      tune
    </span>
  </div>
  <div
    class="relative flex h-screen w-full max-w-[900px] flex-col items-center justify-between"
  >
    <div class="m-8 text-center">
      <h2 class="text-2xl font-medium md:text-xl lg:text-2xl">
        Transfer your data!
      </h2>
      <p class="mt-2 text-sm text-gray-700">What shoud this device do?</p>
    </div>
    <div class="relative h-[55vh] w-full">
      <div
        class="absolute left-1/4 top-[25%] h-[75%] w-1/2 rounded-xl border-x-4 border-t-[10px] lg:top-[27%]"
      />
      <div
        class="action-item absolute left-1/4 top-[5%] flex w-1/2 flex-col items-center justify-center text-sm lg:cursor-pointer"
        on:click={openSheet}
        on:keypress={openSheet}
      >
        <span class="material-symbols-rounded text-4xl text-sky-500">
          arrow_upward
        </span>
        Send
      </div>
      <div
        on:click={() => showToast("Listening for senders!")}
        on:keypress={() => showToast("Listening for senders!")}
        class="action-item absolute left-1/4 top-[35%] flex w-1/2 flex-col items-center justify-center text-sm lg:cursor-pointer"
      >
        <span class="material-symbols-rounded text-4xl text-sky-500">
          arrow_downward
        </span>
        Receive
      </div>
    </div>
    <SendingSheet />
  </div>
</div>
<div
  class:visible
  class="fixed left-0 top-0 z-10 hidden h-screen w-screen bg-black opacity-50"
  on:click={closeSheet}
  on:keypress={closeSheet}
/>

<style>
  .visible {
    display: flex !important;
  }
</style>

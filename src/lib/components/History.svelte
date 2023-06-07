<script lang="ts">
  import { fade } from "svelte/transition";
  import {
    historyPageOpen,
    historyPageSection,
    sendingList,
    receivingList,
    currentlySending,
    currentlyReceiving,
    sendingQueue,
    receivingQueue,
    sentList,
    receivedList,
    sheetVisible,
  } from "../store/store";
  import FileProgressCard from "./FileProgressCard.svelte";
  import { get } from "svelte/store";

  const goBack = () => {
    historyPageOpen.set(false);
    sheetVisible.set(false);
  };
  const clear = () => {
    if (get(historyPageSection) == "received") {
      let choice = confirm("Clear history for all received files?");
      if (choice) {
        let $totalList = get(receivingList);
        let $alreadyReceived = get(receivedList);
        $alreadyReceived.forEach((values, key) => {
          $totalList.delete(key);
        });
        receivingList.set($totalList);
      }
    } else {
      let choice = confirm("Clear history for all sent files?");
      if (choice) {
        let $totalList = get(sendingList);
        let $alreadySent = get(sentList);
        $alreadySent.forEach((values, key) => {
          $totalList.delete(key);
        });
        sendingList.set($totalList);
      }
    }
  };
</script>

<div
  class="flex w-screen flex-col items-center justify-center"
>
  <div
    class="icon mb-6 flex w-full justify-start gap-4 pl-3 pt-4 lg:cursor-pointer lg:pr-8 lg:pt-6"
  >
    <span
      on:click={goBack}
      on:keypress={goBack}
      class="material-symbols-rounded text-2xl"
    >
      arrow_back
    </span>
  </div>
  <div
    class="relative flex h-screen w-full max-w-[900px] flex-col items-center"
  >
    <div class="flex w-full items-center justify-between px-6">
      <h1 class="text-3xl font-medium">History</h1>
      <div class="segmented-buttons flex text-sm">
        <button
          on:click={() => {
            historyPageSection.set("sent");
          }}
          class="rounded-l-full border-2 border-r-0 border-solid border-zinc-700 p-2 px-8 {$historyPageSection ==
          'sent'
            ? 'bg-sky-300 font-medium text-sky-950'
            : ''}">Sent</button
        >
        <button
          on:click={() => {
            historyPageSection.set("received");
          }}
          class="rounded-r-full border-2 border-solid border-zinc-700 p-2 px-4 {$historyPageSection ==
          'received'
            ? 'bg-sky-300 font-medium text-sky-950'
            : ''}">Received</button
        >
      </div>
    </div>
    <div class="w-full p-6">
      {#if $historyPageSection == "sent"}
        {#if [...$sendingList.keys()].length}
          {#each [...$currentlySending.values(), ...$sendingQueue.values()] as progressInfo}
            <FileProgressCard
              fileName={progressInfo.fileName}
              fileType={progressInfo.fileType}
              progressSize={progressInfo.sentSize}
              size={progressInfo.size}
              deviceID={progressInfo.to}
            />
          {/each}
        {:else}
          <div class="flex h-[60vh] items-center justify-center">
            Nothing here yet!
          </div>
        {/if}
      {/if}
      {#if $historyPageSection == "received"}
        {#if [...$receivingList.keys()].length}
          {#each [...$currentlyReceiving.entries(), ...$receivingQueue.entries()] as progressInfo}
            <FileProgressCard
              fileName={progressInfo[1].fileName}
              fileType={progressInfo[1].fileType}
              progressSize={progressInfo[1].receivedSize}
              size={progressInfo[1].size}
              deviceID={progressInfo[1].from}
              link={progressInfo[1].link}
              id={progressInfo[0]}
            />
          {/each}
        {:else}
          <div class="flex h-[60vh] items-center justify-center">
            Nothing here yet!
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <div
    on:click={clear}
    on:keypress={clear}
    class="clear-all absolute bottom-0 mb-[10%] flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 lg:cursor-pointer"
  >
    <span class="material-symbols-rounded text-rose-100"> delete </span>
  </div>
</div>

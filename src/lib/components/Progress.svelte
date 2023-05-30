<script lang="ts">
  import FileProgressCard from "./FileProgressCard.svelte";
  import {
    currentlyReceiving,
    currentlySending,
    receivingList,
    receivingQueue,
    sendingList,
    sendingQueue,
  } from "../store/store";
  const scroll = () => {
    var main = document.getElementsByTagName("main")[0];
    main.scrollTop = 0;
  };
</script>

<div class="relative flex h-screen w-screen flex-col items-center lg:border-dashed lg:border-4 lg:p-8 lg:w-1/2">
  <div
    on:click={scroll}
    on:keypress={scroll}
    class="down-icon absolute top-8 cursor-pointer"
  >
    <span class="material-symbols-rounded text-[2rem] lg:hidden"> expand_more </span>
  </div>
  <div class="mt-14 h-[90%] w-full overflow-scroll">
    {#if [...$sendingList.keys()].length || [...$receivingList.keys()].length}
      {#if [...$sendingList.keys()].length}
        <div class="progress-wrapper flex min-h-[13rem] w-full flex-col p-8">
          <h1 class="mb-6 text-3xl font-semibold">sending</h1>
          {#each [...$currentlySending.values(), ...$sendingQueue.values()] as progressInfo}
            <FileProgressCard
              fileName={progressInfo.fileName}
              fileType={progressInfo.fileType}
              progressSize={progressInfo.sentSize}
              size={progressInfo.size}
              deviceID={progressInfo.to}
            />
          {/each}
        </div>
      {/if}
      {#if [...$receivingList.keys()].length}
        <div class="progress-wrapper flex min-h-[13rem] w-full flex-col p-8">
          <h1 class="mb-6 text-3xl font-semibold">receiving</h1>
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
        </div>
      {/if}
    {:else}
      <div class="flex h-full w-full items-center justify-center font-semibold text-2xl">
        nothing here yet 🍃
      </div>
    {/if}
  </div>
</div>

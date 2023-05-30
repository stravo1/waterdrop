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

<div class="relative flex h-screen w-screen flex-col items-center">
  <div
    on:click={scroll}
    on:keypress={scroll}
    class="down-icon absolute top-8 cursor-pointer"
  >
    <span class="material-symbols-rounded text-[2rem]"> expand_more </span>
  </div>
  <div class="mt-14 h-[90%] w-full overflow-scroll">
    <div class="progress-wrapper flex min-h-[13rem] w-full flex-col p-8">
      <h1 class="mb-6 text-3xl font-semibold">sending</h1>
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
        Nothing is being sent right now!
      {/if}
    </div>
    <div class="progress-wrapper flex min-h-[13rem] w-full flex-col p-8">
      <h1 class="mb-6 text-3xl font-semibold">receiving</h1>
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
        Nothing is being received right now!
      {/if}
    </div>
  </div>
</div>

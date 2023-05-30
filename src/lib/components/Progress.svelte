<script lang="ts">
  import FileProgressCard from "./FileProgressCard.svelte";

  const scroll = () => {
    var main = document.getElementsByTagName("main")[0];
    main.scrollTop = 0;
  };
</script>

<div class="relative flex h-screen w-screen flex-col items-center">
  <div on:click={scroll} on:keypress={scroll} class="down-icon absolute top-8 cursor-pointer">
    <span class="material-symbols-rounded text-[2rem]"> expand_more </span>
  </div>
  <div class="mt-14 h-[90%] w-full overflow-scroll">
    <div class="progress-wrapper flex flex-col min-h-[13rem] w-full p-8">
      <h1 class="text-3xl mb-6 font-semibold">sending</h1>
      <FileProgressCard
        fileName="filename.pdf"
        fileType="image"
        progress="60"
        ETA="125"
        progressSize="3.24"
        size="9.42"
        deviceName="Google Chrome - Android Mobile"
      />
      <FileProgressCard
        fileName="filename.pdf"
        fileType="document"
        progress="60"
        ETA="125"
        progressSize="3.24"
        size="9.42"
        deviceName="Google Chrome - Android Mobile"
      />
    </div>
    <!-- <div class="progress-wrapper flex min-h-[13rem] w-full p-8">
      <h1 class="text-3xl font-semibold">receiving</h1>
    </div> -->
  </div>
</div>

<script lang="ts">
  import { get } from "svelte/store";
  import { connectedDevices } from "../store/store";
  import { bytesToSize } from "../utilities/misc";
  import { onDestroy, onMount } from "svelte";

  export let fileName: string;
  export let fileType: string;
  export let size: number;
  export let progressSize: number;
  export let deviceID: string;
  export let link: string = "";
  export let id: string = "";

  const getTime = (time: number) => {
    if (time == -1) {
      if (progressSize > 0) {
        return "Calculating remaining time";
      }
      return "Not started yet";
    }
    const hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    var result = "";
    hours ? (result += `${hours} hours `) : (result += "");
    minutes ? (result += `${minutes} minutes `) : (result += "");
    seconds ? (result += `${seconds} seconds`) : (result += "");
    return result + " left";
  };
  const getIcon = (arg: string) => {
    switch (arg) {
      case "image":
        return "image";
      case "video":
        return "movie";
      case "audio":
        return "music_note";
      default:
        return "draft";
    }
  };
  const getDeviceInfo = (deviceID: string) => {
    let $deviceList = get(connectedDevices);
    let info = $deviceList.get(deviceID);
    return info.name;
  };

  const download = () => {
    if (!link || !id) {
      return;
    }
    var a = document.createElement("a");

    a.href = link;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
  };

  let esimatedEnd = -1;
  let prevSize = 0;
  let interval = 500;
  let timer;

  onMount(() => {
    timer = setInterval(() => {
      if (!prevSize) {
        esimatedEnd = -1;
      } else {
        var sizeDifference = progressSize - prevSize;
        var remainingSize = size - progressSize;
        var speed = sizeDifference / (interval / 1000);
        esimatedEnd = Math.round(remainingSize / speed);
      }
      prevSize = progressSize;
    }, interval);
  });

  onDestroy(() => {
    clearInterval(timer);
  });
</script>

<div
  class="card relative my-2 flex w-full py-5 {link ? 'cursor-pointer' : ''}"
  on:click={download}
  on:keypress={download}
>
  <div
    class="icon flex h-12 shrink-0 grow-0 basis-12 items-center justify-center rounded-full border-2 border-solid"
  >
    <span class="material-symbols-rounded text-3xl text-zinc-600">
      {getIcon(fileType)}
    </span>
  </div>
  <div class="info mx-4 box-border flex w-4/5 flex-col gap-1">
    <div
      class="file-name w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg"
    >
      {fileName}
    </div>

    <div
      class="eta w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium"
    >
      {#if link}
        Click to download! - Received from {getDeviceInfo(deviceID)}
      {:else if progressSize >= size}
        Sent to {getDeviceInfo(deviceID)}
      {:else}
        {getTime(esimatedEnd)} - {bytesToSize(progressSize)} / {bytesToSize(
          size
        )}
      {/if}
    </div>
  </div>
</div>

<style>
  .material-symbols-rounded {
    font-variation-settings: "FILL" 1, "wght" 600, "GRAD" 0, "opsz" 48;
  }
</style>

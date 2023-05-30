<script lang="ts">
  import { get } from "svelte/store";
  import { connectedDevices, receivingList } from "../store/store";
  import { bytesToSize, showToast } from "../utilities/misc";
  import { onMount } from "svelte";

  export let fileName: string;
  export let fileType: string;
  export let size: number;
  export let progressSize: number;
  export let deviceID: string;
  export let link: string = "";
  export let id: string = "";

  const getTime = (time: number) => {
    if (time == -1) return "Not started yet";
    const hours = Math.floor(time / 3600);
    time = time - hours * 3600;
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    var result = "";
    hours ? (result += `${hours} hours `) : (result += "");
    minutes ? (result += `${minutes} minutes `) : (result += "");
    seconds ? (result += `${seconds} seconds`) : (result += "");
    return result;
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
    return `${info.name} - ${info.platform} ${info.deviceType}`;
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

  const remove = (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();

    var $receiveList = get(receivingList);
    $receiveList.delete(id);
    receivingList.set($receiveList);
  };

  let esimatedEnd = -1;
  let prevSize = 0;
  let interval = 1000;

  onMount(() => {
    setInterval(() => {
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
</script>

<div
  class="card relative my-2 flex w-full rounded-lg bg-zinc-100 p-4 py-5 {link
    ? 'cursor-pointer'
    : ''}"
  on:click={download}
  on:keypress={download}
>
  <div
    on:click={remove}
    on:keypress={remove}
    class="icon absolute right-4 top-2 flex items-center justify-center {!link
      ? 'hidden'
      : ''}"
  >
    <span class="material-symbols-rounded text-zinc-400"> close </span>
  </div>
  <div class="icon flex h-[50px] items-center justify-center">
    <span class="material-symbols-rounded text-[42px] text-zinc-400">
      {getIcon(fileType)}
    </span>
  </div>
  <div class="info mx-4 flex flex-col gap-2">
    <div
      class="file-name w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium"
    >
      {fileName}
    </div>
    <div class="progress-bar relative h-3 w-full">
      <div
        class="outer-bar absolute left-0 top-0 h-3 w-full rounded-full bg-zinc-300"
      />
      <div
        class="inner-bar absolute left-0 top-0 h-3 rounded-full bg-rose-300"
        style="width: {Math.round((progressSize / size) * 100)}%;"
      />
    </div>
    <div class="eta text-xs font-medium">
      {#if link}
        File received! Click to download!
      {:else}
        {getTime(esimatedEnd)} left
      {/if}
    </div>
    <div
      class="device w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium"
    >
      {bytesToSize(progressSize)} / {bytesToSize(size)} - {getDeviceInfo(
        deviceID
      )}
    </div>
  </div>
</div>

<style>
  .info {
    width: calc(100vw - 10.5rem);
  }
</style>

<script lang="ts">
  export let fileName: string;
  export let fileType: string;
  export let ETA: string;
  export let progress: string;
  export let size: string;
  export let progressSize: string;
  export let deviceName: string;

  const getTime = (arg: string) => {
    var hours = Math.round(parseInt(arg) / 3600);
    var minutes = Math.round(parseInt(arg) / 60);
    var seconds = Math.round(parseInt(arg) % 60);
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
</script>

<div class="card my-2 flex w-full rounded-lg bg-zinc-100 p-4 py-5">
  <div class="icon flex h-[50px] items-center justify-center">
    <span class="material-symbols-rounded text-[42px] text-zinc-400">
      {getIcon(fileType)}
    </span>
  </div>
  <div class="info mx-4 flex flex-col gap-2">
    <div class="file-name text-lg font-medium">
      {fileName}
    </div>
    <div class="progress-bar relative h-3 w-full">
      <div
        class="outer-bar absolute left-0 top-0 h-3 w-full rounded-full bg-zinc-300"
      />
      <div
        class="inner-bar absolute left-0 top-0 h-3 rounded-full bg-rose-300"
        style="width: {progress}%;"
      />
    </div>
    <div class="eta text-xs font-medium">
      {getTime(ETA)} left
    </div>
    <div
      class="device w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium"
    >
      {progressSize}mb / {size}mb - {deviceName}
    </div>
  </div>
</div>

<style>
  .info {
    width: calc(100vw - 10.5rem);
  }
</style>

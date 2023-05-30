<script lang="ts">
  export let deviceType;
  export let name;
  export let platform;

  const getIcon = (arg: string) => {
    switch (arg) {
      case "mobile":
        return "smartphone";
      case "tablet":
        return "tablet";
      case "desktop":
        return "computer";
      default:
        return "devices";
    }
  };
</script>

<div class="card my-2 flex w-full rounded-lg bg-zinc-100 p-4 py-5">
  <div class="icon flex h-[50px] items-center justify-center">
    <span class="material-symbols-rounded text-[42px] text-zinc-400">
      {getIcon(deviceType)}
    </span>
  </div>
  <div class="info mx-4 flex flex-col gap-1">
    <div class="file-name text-lg font-medium capitalize">
      {name}
    </div>
    <div class="type text-xs font-medium capitalize">
      {platform} - {deviceType}
    </div>
  </div>
</div>

<script lang="ts">
  import { get } from "svelte/store";
  import { sendFiles, sendText } from "../utilities/misc";
  import { textInput } from "../store/store";

  export let deviceType;
  export let name;
  export let id;

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

  const send = (deviceID: string) => {
    if (get(textInput)) {
      sendText(deviceID);
    } else {
      sendFiles(deviceID);
    }
  };
</script>

<div
  on:click={() => {
    send(id);
  }}
  on:keypress={() => {
    send(id);
  }}
  class="card my-2 flex w-1/4 cursor-pointer flex-col items-center justify-center rounded-lg bg-zinc-100 p-4 py-5"
>
  <div
    class="icon flex h-12 w-12 items-center justify-center rounded-full border-4 border-solid"
  >
    <span class="material-symbols-rounded text-zinc-400">
      {getIcon(deviceType)}
    </span>
  </div>
  <div class="info mt-2">
    <div
      class="file-name w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium capitalize"
    >
      {name}
    </div>
  </div>
</div>

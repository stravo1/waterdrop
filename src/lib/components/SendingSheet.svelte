<script>
  import { onDestroy, onMount } from "svelte";
  import ReceivingDevices from "./ReceivingDevices.svelte";
  import SendingOptions from "./SendingOptions.svelte";
  import { selectedFiles, sheetVisible, textInput } from "../store/store";
  import { get } from "svelte/store";
  import { fade, fly } from "svelte/transition";

  let visible;

  let unsubText;
  let unsubFiles;
  let unsubVisible;
  onMount(() => {
    var element = document.getElementById("bottom-sheet");
    element.scrollLeft = 0;
    unsubText = textInput.subscribe((arg) => {
      if (arg) {
        element.scrollLeft = element.scrollWidth;
        element.setAttribute("style", "height: fit-content");
      } else {
        if (!get(selectedFiles).length) {
          element.scrollLeft = 0;
          element.setAttribute("style", "height: 8rem");
        }
      }
    });
    unsubFiles = selectedFiles.subscribe((arg) => {
      if (arg.length) {
        element.scrollLeft = element.scrollWidth;
        element.setAttribute("style", "height: fit-content !important");
      } else {
        if (!get(textInput)) {
          element.scrollLeft = 0;
          element.setAttribute("style", "height: 8rem");
        }
      }
    });
  });
  unsubVisible = sheetVisible.subscribe((arg) => {
    visible = arg;
  });

  onDestroy(() => {
    unsubText();
    unsubFiles();
    unsubFiles();
  });
</script>

<div
  class="fixed bottom-0 z-[-1] w-full scroll-smooth opacity-0 lg:fixed lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:w-fit lg:max-w-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]"
  class:visible
>
  <div
    id="bottom-sheet"
    class="flex w-full overflow-hidden rounded-t-2xl bg-zinc-100 lg:mx-4 lg:rounded-b-2xl"
  >
    <SendingOptions />
    <ReceivingDevices />
  </div>
</div>

<style>
  .visible {
    opacity: 100%; /* imp to use opacity else scroll length is not available immediately after spawn */
    z-index: 20;
  }
</style>

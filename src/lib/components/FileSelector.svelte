<script lang="ts">
  import { selectedFiles } from "../store/store";
  import { showToast } from "../utilities/misc";

  const scroll = () => {
    var main = document.getElementsByTagName("main")[0];
    main.scrollTop = main.scrollHeight;
  };
  const drop = (ev: DragEvent) => {
    let files: File[] = [];
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          files.push(file);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        files.push(file);
      });
    }
    showToast(`${files.length} file(s) selected!`);
    selectedFiles.set(files);
  };
  const drag = (ev: DragEvent) => {
    ev.preventDefault();
  };
  const openSelector = () => {
    document.getElementById("file-selector").click();
  };
  const handleFileInputs = (ev: Event) => {
    ev.preventDefault();
    const input = ev.target as HTMLInputElement;
    let files: File[] = [];
    [...input.files].forEach((file, i) => {
      files.push(file);
    });
    showToast(`${files.length} file(s) selected!`);
    selectedFiles.set(files);
  };
</script>

<div
  on:drop={drop}
  on:dragover={drag}
  on:click={openSelector}
  on:keypress={openSelector}
  class="relative flex h-screen w-screen cursor-pointer flex-col items-center justify-center"
>
  <div class="wrapper">
    <div class="select-icon flex justify-center">
      <span class="material-symbols-rounded"> deployed_code </span>
    </div>
    <div class="text font-medium">click to send files</div>
  </div>
  <div
    on:click={scroll}
    on:keypress={scroll}
    class="down-icon absolute bottom-8 cursor-pointer"
  >
    <span class="material-symbols-rounded text-[2rem]"> expand_less </span>
  </div>
</div>

<input
  type="file"
  id="file-selector"
  class="hidden"
  multiple
  on:change={handleFileInputs}
/>

<style>
  .select-icon > span {
    font-size: 96px;
  }
</style>

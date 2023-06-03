<script lang="ts">
  import { onMount } from "svelte";
  import { settingsVisible } from "../store/store";
  import { fade } from "svelte/transition";
  import { showToast } from "../utilities/misc";

  let name;
  let url;
  let oldUrl;
  // let visibility;

  onMount(() => {
    name = localStorage.getItem("name");
    url = localStorage.getItem("url");
    oldUrl = localStorage.getItem("url");
    // visibility = localStorage.getItem("visibility");
  });

  const handleNameChange = (e) => {
    name = e.target.value;
    localStorage.setItem("name", e.target.value);
  };

  const handleSelectChange = (e) => {
    if (e.target.value == "render") {
      url = "https://waterdrop-sqxs.onrender.com";
      localStorage.setItem("url", "https://waterdrop-sqxs.onrender.com");
    } else if (e.target.value == "glitch") {
      url = "https://waterdrop-server.glitch.me";
      localStorage.setItem("url", "https://waterdrop-server.glitch.me");
    } else {
      if (
        oldUrl != "https://waterdrop-sqxs.onrender.com" ||
        oldUrl != "https://waterdrop-server.glitch.me"
      ) {
        url = oldUrl;
        localStorage.setItem("url", oldUrl);
      } else {
        url = "";
      }
    }
    showToast("Please refresh the page after making any changes!");
  };

  const handleURLChange = (e) => {
    url = e.target.value;
    oldUrl = e.target.value;
    localStorage.setItem("url", e.target.value);
  };

  const closeSettings = () => {
    settingsVisible.set(false);
  };
</script>

<div
  transition:fade={{ duration: 250 }}
  class="absolute top-0 z-[100] flex h-screen w-screen items-center justify-center bg-white"
>
  <div
    on:click={closeSettings}
    on:keypress={closeSettings}
    class="icon absolute right-6 top-8 z-[100] flex cursor-pointer justify-center"
  >
    <span class="material-symbols-rounded text-3xl"> close </span>
  </div>
  <div
    class="relative flex h-full w-screen min-w-[370px] flex-col overflow-scroll bg-white p-8 lg:w-[30vw] lg:border-4 lg:border-dashed"
  >
    <h1 class="mb-10 text-4xl font-semibold">settings</h1>
    <div class="settings-item mb-6 w-full">
      <label for="name" class="mb-2 block text-2xl font-medium">name:</label>
      <div class="mb-4 text-sm">
        please make sure this name is same in all your devices. this name is
        used to differentiate between your devices and the devices of others' in
        the same network.
      </div>
      <input
        class="h-12 w-full rounded-lg bg-zinc-100 p-4 text-lg"
        type="text"
        name="name"
        id="name"
        placeholder="enter name here"
        value={name}
        on:change={handleNameChange}
      />
    </div>
    <div class="settings-item mb-4 w-full">
      <label for="name" class="mb-2 block text-2xl font-medium">server:</label>
      <div class="mb-4 text-sm">
        currently the public server for waterdrop is hosted on
        <a class="underline" href="http://www.render.com" target="_blank"
          >render</a
        >
        &
        <a class="underline" href="http://www.glitch.com" target="_blank"
          >glitch</a
        >
        on their free plans with limited monthly quota. please use the public servers
        only when it's necessary. to learn how to setup your own local server for
        waterdrop, <a class="underline" href="">click here</a>.
      </div>
      <select
        class="h-14 w-full rounded-lg bg-zinc-100 p-4 text-lg"
        name="name"
        id="name"
        on:change={handleSelectChange}
      >
        <option
          value="render"
          selected={url == "https://waterdrop-sqxs.onrender.com"}
          >public server - render</option
        >
        <option
          value="glitch"
          selected={url == "https://waterdrop-server.glitch.me"}
          >public server - glitch</option
        >
        <option value="local" selected={true}>local server</option>
      </select>
      <input
        class="mt-2 h-14 w-full rounded-lg bg-zinc-100 p-4 text-lg {url ==
          'https://waterdrop-sqxs.onrender.com' ||
        url == 'https://waterdrop-server.glitch.me' ||
        url == undefined
          ? 'hidden'
          : ''}"
        type="text"
        name="name"
        id="name"
        placeholder="enter local server url"
        value={url}
        on:change={handleURLChange}
      />
    </div>
    <div class="mt-8 text-center text-sm">settings are auto saved!</div>
  </div>
</div>

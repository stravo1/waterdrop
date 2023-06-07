<script lang="ts">
  import { onMount } from "svelte";
  import { settingsPageOpen } from "../store/store";
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
        oldUrl != "https://waterdrop-sqxs.onrender.com" &&
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
    settingsPageOpen.set(false);
  };
</script>

<div
  transition:fade={{ duration: 75 }}
  class="flex h-screen w-screen flex-col bg-white"
>
  <div
    on:click={closeSettings}
    on:keypress={closeSettings}
    class="icon mb-6 flex w-full justify-start pl-3 pt-4 lg:cursor-pointer lg:pr-8 lg:pt-6"
  >
    <span class="material-symbols-rounded text-3xl"> arrow_back </span>
  </div>
  <div class="relative mx-8 flex h-screen max-w-[900px] flex-col">
    <h1 class="mb-8 text-3xl font-medium">Settings</h1>
    <hr>
    <div class="settings-item my-6 w-full">
      <label for="name" class="mb-1 block text-lg font-medium"
        >Device name:</label
      >
      <div class="mb-4 text-xs text-gray-500">
        Provide a specific name for this device such as 'iPhone 12 mini',
        'Lenovo ThinkPad' or 'moto g52'.
      </div>
      <input
        class="h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm"
        type="text"
        name="name"
        id="name"
        placeholder="enter name here"
        value={name}
        on:change={handleNameChange}
      />
    </div>
    <hr>
    <div class="settings-item my-4 w-full">
      <label for="name" class="mb-2 block text-lg font-medium">Server:</label>
      <div class="mb-4 text-xs text-gray-500">
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
        class="h-10 w-full rounded-lg bg-zinc-100 px-4 text-sm"
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
        class="mt-2 h-10 w-full rounded-lg bg-zinc-100 p-4 text-sm {url ==
          'https://waterdrop-sqxs.onrender.com' ||
        url == 'https://waterdrop-server.glitch.me'
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
    <hr>
    <div class="mt-8 text-center text-xs text-gray-500">settings are auto saved!</div>
  </div>
</div>

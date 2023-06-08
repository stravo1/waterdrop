import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "WaterDrop",
        short_name: "WaterDrop",
        description: "broswer based alternative to AirDrop",
        theme_color: "#ffffff",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "white",

        share_target: {
          action: "/share",
          enctype: "multipart/form-data",
          method: "POST",
          params: {
            title: "name",
            text: "description",
            url: "link",
            files: [
              {
                name: "media",
                accept: [
                  "audio/*",
                  "image/*",
                  "video/*",
                  "application/*",
                  "text/*",
                  "font/*",
                ],
              },
            ],
          },
        },
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: "/share",
            method: "POST",
            handler: async ({ event }) => {
              const trigger = await caches.open("trigger");
              await trigger.put(
                "trigger",
                new Response(new Blob(["trigger"], { type: "text/plain" }))
              );
              const formData = await event.request.formData();

              const mediaFiles = formData.getAll("media");
              const texts = formData.getAll("description");

              const cache = await caches.open("add");
              for (const mediaFile of mediaFiles) {
                // TODO: Instead of bailing, come up with a
                // default name for each possible MIME type.

                const cacheKey = mediaFile.name;
                await cache.put(
                  cacheKey,
                  new Response(mediaFile, {
                    headers: {
                      "content-length": mediaFile.size,
                      "content-type": mediaFile.type,
                    },
                  })
                );
              }
              for (const text of texts) {
                const cacheKey = new URL(`${Date.now()}`, self.location).href;
                const txtBlob = new Blob([text], { type: "text/plain" });
                await cache.put(
                  cacheKey,
                  new Response(txtBlob, {
                    headers: {
                      "content-length": txtBlob.size.toString(),
                      "content-type": "text/plain",
                    },
                  })
                );
              }
              //postMsg("file received");
              return Response.redirect("/", 303);
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});

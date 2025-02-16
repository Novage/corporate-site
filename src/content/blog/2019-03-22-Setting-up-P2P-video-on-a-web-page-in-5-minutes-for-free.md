---
author: Andriy Lysnevych
date: "2019-03-22"
title: "Setting up P2P Video on a Web Page in 5 Minutes for Free"
slug: setting-up-p2p-video-on-a-web-page-in-5-minutes-for-free
description: 'This article will give you instructions on how to easily, quickly and 100% for free enable P2P video delivery on your HTML5 web pages that stream HLS or MPEG-DASH videos with open-source <a href="https://github.com/novage/p2p-media-loader">P2P Media Loader</a> JavaScript library by <a href="https://novage.com.ua/">Novage</a> (see <a href="http://novage.com.ua/p2p-media-loader/demo">the demo</a>).'
---

This article will give you instructions on how to easily, quickly and 100% for free enable P2P video delivery on your HTML5 web pages that stream HLS or MPEG-DASH videos with open-source [P2P Media Loader](https://github.com/novage/p2p-media-loader) JavaScript library by [Novage](https://novage.com.ua/) (see [the demo](http://novage.com.ua/p2p-media-loader/demo)).

The approach supports both live and VOD video streams and doesn’t require installing and running any server-side software.

## What are the benefits of P2P video?

In peer-to-peer video delivery network (also called P2P CDN) each player (peer) shares downloaded video segments with other visitors that watch the same stream. Up to 90% of the video can be transferred over a P2P network. This results in:

- Lower CDN cost: When streaming content with P2P, most video requests are served inside P2P network rather than the origin server or CDN. This significantly lowers the total data load on centralized infrastructure, resulting in substantial cost savings. For instance, if it normally costs $100 to deliver a stream through a CDN, achieving a 90% P2P ratio could reduce that expense to just $10.

- Increased bandwidth, stability and quality: Each peer is contributing to the overall bandwidth by simultaneously uploading the video stream to others. And if your source bandwidth allows streaming a video to 100 users, with 90% P2P your video can be viewed by 1000 users.

- Improved reliability: P2P acceleration makes video streaming more scalable, resistant to peak demands and failure situations.

## Instructions

### Using P2P Media Loader with npm

To include **P2P Media Loader** in your project using npm, follow these steps:

1. Install the package via npm:

   - For HLS.js integration:

     ```bash
     npm install p2p-media-loader-hlsjs
     ```

   - For Shaka Player integration:
     ```bash
     npm install p2p-media-loader-shaka
     ```

2. Provide Node.js polyfills

   To ensure the P2P Media Loader works correctly in a browser environment, you must provide Node.js polyfills required by [bittorrent-tracker](https://www.npmjs.com/package/bittorrent-tracker) dependency.

   - Vite configuration example:

     ```typescript
     // vite.config.ts
     import { defineConfig } from "vite";
     import { nodePolyfills } from "vite-plugin-node-polyfills";

     export default defineConfig({
       plugins: [nodePolyfills()],
     });
     ```

   - Webpack configuration example:

     ```javascript
     // webpack.config.mjs
     import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

     export default {
       plugins: [new NodePolyfillPlugin({ additionalAliases: ["process"] })],
     };
     ```

3. Import and use it in your project:

   - HLS.js integration:

     ```typescript
     import Hls from "hls.js";
     import { HlsJsP2PEngine } from "p2p-media-loader-hlsjs";

     const HlsWithP2P = HlsJsP2PEngine.injectMixin(Hls);
     ```

   - Shaka Player integration:

     ```typescript
     import shaka from "shaka-player/dist/shaka-player.ui";
     import { ShakaP2PEngine } from "p2p-media-loader-shaka";

     ShakaP2PEngine.registerPlugins(shaka);
     ```

For more examples with npm packages, you may check our [React demo](https://github.com/Novage/p2p-media-loader/tree/main/packages/p2p-media-loader-demo/src/components/players)

## Using P2P Media Loader with CDN via JavaScript Modules

For HLS video:

```html
<script type="importmap">
  {
    "imports": {
      "p2p-media-loader-core": "https://cdn.jsdelivr.net/npm/p2p-media-loader-core@^2/dist/p2p-media-loader-core.es.min.js",
      "p2p-media-loader-hlsjs": "https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@^2/dist/p2p-media-loader-hlsjs.es.min.js"
    }
  }
</script>
```

For MPEG-DASH video:

```html
<script type="importmap">
  {
    "imports": {
      "p2p-media-loader-core": "https://cdn.jsdelivr.net/npm/p2p-media-loader-core@^2/dist/p2p-media-loader-core.es.min.js",
      "p2p-media-loader-shaka": "https://cdn.jsdelivr.net/npm/p2p-media-loader-shaka@^2/dist/p2p-media-loader-shaka.es.min.js"
    }
  }
</script>
```

### Integrating P2P with Vidstack and Hls.js

**P2P Media Loader** supports many players that use Hls.js as media engine. Lets pick [Vidstack](https://www.vidstack.io/) player for extended Hls.js example:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Include Hls.js library from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@~1/dist/hls.min.js"></script>

    <!-- Import map for P2P Media Loader modules -->
    <script type="importmap">
      {
        "imports": {
          "p2p-media-loader-core": "https://cdn.jsdelivr.net/npm/p2p-media-loader-core@^2/dist/p2p-media-loader-core.es.min.js",
          "p2p-media-loader-hlsjs": "https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@^2/dist/p2p-media-loader-hlsjs.es.min.js"
        }
      }
    </script>

    <!-- Include Vidstack player stylesheets -->
    <link rel="stylesheet" href="https://cdn.vidstack.io/player/theme.css" />
    <link rel="stylesheet" href="https://cdn.vidstack.io/player/video.css" />

    <!-- Module script to initialize Vidstack player with P2P Media Loader -->
    <script type="module">
      // Include Vidstack player library from CDN
      import {
        VidstackPlayer,
        VidstackPlayerLayout,
      } from "https://cdn.vidstack.io/player";

      // Check if the browser supports import maps and Hls.js
      const isP2PSupported =
        HTMLScriptElement.supports("importmap") && Hls.isSupported();

      let HlsWithP2P;
      if (isP2PSupported) {
        // Inject P2P capabilities into Hls.js
        const { HlsJsP2PEngine } = await import("p2p-media-loader-hlsjs");
        HlsWithP2P = HlsJsP2PEngine.injectMixin(window.Hls);
      }

      const player = await VidstackPlayer.create({
        target: "#player",
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        playsInline: true,
        layout: new VidstackPlayerLayout(),
      });

      player.addEventListener("provider-change", (event) => {
        const provider = event.detail;

        // Check if the provider is HLS
        if (provider?.type === "hls") {
          provider.library = HlsWithP2P;

          provider.config = {
            p2p: {
              core: {
                swarmId: "Optional custom swarm ID for stream",
                // other P2P engine config parameters go here
              },
              onHlsJsCreated: (hls) => {
                hls.p2pEngine.addEventListener("onPeerConnect", (params) => {
                  console.log("Peer connected:", params.peerId);
                });
                // Subscribe to P2P engine and Hls.js events here
              },
            },
          };
        }
      });
    </script>
  </head>

  <body>
    <div style="width: 800px">
      <div id="player"></div>
    </div>
  </body>
</html>
```

To find more examples please refer to our [GitHub repository](https://github.com/Novage/p2p-media-loader/) and [API documentation](https://novage.github.io/p2p-media-loader/docs/latest/).

Now you can lean back and enjoy your P2P video streaming.

## What’s next

Getting better P2P video sharing ratios most likely requires tuning of both your video stream and P2P algorithm configuration.

**P2P Media Loader** uses freely available in WebTorrent trackers to exchange connection data (SDP) between peers. This process is called WebRTC signaling. Using public trackers is fine for moderate (1000–2000) number of peers. But for higher loads, you have to run your personal tracker instances (for example [wt-tracker](https://github.com/Novage/wt-tracker)).

You will learn how to improve P2P ratio, create your personal P2P video network and scale it to millions of peers in the next articles.

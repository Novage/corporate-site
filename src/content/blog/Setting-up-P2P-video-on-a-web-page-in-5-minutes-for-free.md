---
canonicalURL: https://novage.com.ua/blog/setting-up-p2p-video-on-a-web-page-in-5-minutes-for-free
author: Andriy Lysnevych
date: "2019-03-22"
title: "Setting up p2p video on a web page in 5 minutes for free"
description: 'This article will give you instructions on how to easily, quickly and 100% for free enable P2P video delivery on your HTML5 web pages that stream HLS or MPEG-DASH videos with open-source <a href="https://github.com/novage/p2p-media-loader">P2P Media Loader</a> JavaScript library by <a href="https://novage.com.ua/">Novage</a> (see <a href="http://novage.com.ua/p2p-media-loader/demo">the demo</a>).'
---

This article will give you instructions on how to easily, quickly and 100% for free enable P2P video delivery on your HTML5 web pages that stream HLS or MPEG-DASH videos with open-source [P2P Media Loader](https://github.com/novage/p2p-media-loader) JavaScript library by [Novage](https://novage.com.ua/) (see [the demo](http://novage.com.ua/p2p-media-loader/demo)).

The approach supports both live and VOD video streams and doesn’t require installing and running any server-side software.

## What are the benefits of P2P video?

In peer-to-peer video delivery network (also called P2P CDN) each player (peer) shares downloaded video segments with other visitors that watch the same stream. Up to 90% of the video can be transferred over a P2P network. This results in:

- Lower CDN cost — if you pay $100 for a CDN to deliver a stream to your users with 90% P2P ratio you will pay only $10.

- Higher bandwidth and better adaptive quality — each peer is contributing to the overall bandwidth by simultaneously uploading the video stream to others. And if your source bandwidth allows streaming a video to 100 users, with 90% P2P your video can be viewed by 1000 users.

- Improved reliability — P2P acceleration makes video streaming more scalable, resistant to peak demands and failure situations.

## Instructions

**Add P2P Media Loader script to your web page**

For HLS video:

```html
<script src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest/build/p2p-media-loader-core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@latest/build/p2p-media-loader-hlsjs.min.js"></script>
```

For MPEG-DASH video:

```html
<script src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest/build/p2p-media-loader-core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/p2p-media-loader-shaka@latest/build/p2p-media-loader-shaka.min.js"></script>
```

**Integrate P2P Media Loader with your favorite player**

**P2P Media Loader** supports many popular HTML5 video players and engines: **Hls.js, Shaka Player, JWPlayer, Clappr, Flowplayer, MediaElement, Video.js.** Let’s pick **Clappr** just for this example:

```html
<script>
  var engine = new p2pml.hlsjs.Engine();
  var player = new Clappr.Player({
    parentId: "#player",
    source:
      "https://akamai-axtest.akamaized.net/routes/lapd-v1-acceptance/www_c4/Manifest.m3u8",
    mute: true,
    autoPlay: true,
    playback: {
      hlsjsConfig: {
        liveSyncDurationCount: 7,
        loader: engine.createLoaderClass(),
      },
    },
  });
  p2pml.hlsjs.initClapprPlayer(player);
</script>
```

You can find the full example as well as examples for other players in the [GitHub](https://github.com/Novage/p2p-media-loader/) repository of the project.

Now you can lean back and enjoy your P2P video streaming.

## What’s next

Getting better P2P video sharing ratios most likely requires tuning of both your video stream and P2P algorithm configuration.

**P2P Media Loader** uses freely available in WebTorrent trackers to exchange connection data (SDP) between peers. This process is called WebRTC signaling. Using public trackers is fine for moderate (1000–2000) number of peers. But for higher loads, you have to run your personal tracker instances (for example [wt-tracker](https://github.com/Novage/wt-tracker)).

You will learn how to improve P2P ratio, create your personal P2P video network and scale it to millions of peers in the next articles.

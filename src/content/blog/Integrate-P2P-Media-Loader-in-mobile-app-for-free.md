---
canonicalURL: https://novage.com.ua/blog/setting-up-P2P-video-in-mobile-app-for-free
author: Dmytro Demchenko
date: "2025-01-29"
title: "Integrating P2P Video streaming into Mobile Applications: Flutter and Native Android Approaches"
description: "In this article you can find ways how to set up Mobile P2P Video streaming"
---

In today’s digital age, video streaming has become an integral part of mobile applications, from social media platforms to on-demand entertainment services. However, delivering high-quality video content efficiently and cost-effectively remains a significant challenge. Traditional Content Delivery Networks (CDNs) often incur substantial bandwidth costs and can struggle with scalability as your user base grows.

Enter Peer-to-Peer (P2P) Streaming Technology. Leveraging the power of WebRTC and peer-to-peer connections, [P2P Media Loader](https://github.com/novage/p2p-media-loader) offers an efficient approach to video streaming. By enabling users to share video data directly with each other, P2P Media Loader reduces reliance on CDNs, leading to lower bandwidth costs, enhanced streaming performance, and improved scalability—crucial benefits as more users access content via mobile devices.

We found a way how to integrate the library into mobile application without maintaining and supporting a lot of different code for different platforms. We wanted to have same codebase for all platforms and we successfully managed to do it.
Both Approaches provided in the article are fully compatible with WEB P2P Media Loader integration. It means that users form browser will share the traffic with mobile users and in reverse.

**Important Note:** P2P (WebRTC) may not connect to the outer world if it runs on Android emulators due to its virtual machine [network configuration](https://developer.android.com/studio/run/emulator-networking) (NAT). Please test P2P connectivity on real devices.

## Flutter Integration

The Flutter integration approach uses a **WebView** that contains a video player with P2P Media Loader integration. Below is a more detailed breakdown for clarity and maintainability:

To setup a video player with P2P Media Loader using webview you need:

### 1. Add the WebView Dependency

We'll use [InAppWebView](https://inappwebview.dev/docs/webview/in-app-webview/) in our Flutter example. Update your `pubspec.yaml` with:

```yaml
dependencies:
  flutter_inappwebview: ^6.1.5
```

### 2. Prepare an HTML File with a Player & P2P Media Loader

We need an HTML file that includes:

- A video player (in this example, the Vidstack player with HLS.js).
- P2P Media Loader to enable peer-to-peer streaming.

Below is a minimal example of an index.html file you can store in your project’s assets folder. This file uses the Vidstack player and configures the P2P engine if it’s supported on the device.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="importmap">
      {
        "imports": {
          "p2p-media-loader-core": "https://cdn.jsdelivr.net/npm/p2p-media-loader-core@^2/dist/p2p-media-loader-core.es.min.js",
          "p2p-media-loader-hlsjs": "https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@^2/dist/p2p-media-loader-hlsjs.es.min.js"
        }
      }
    </script>

    <link rel="stylesheet" href="https://cdn.vidstack.io/player/theme.css" />
    <link rel="stylesheet" href="https://cdn.vidstack.io/player/video.css" />
    <script src="https://cdn.jsdelivr.net/npm/hls.js@~1/dist/hls.min.js"></script>

    <style>
      html,
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="player"></div>
  </body>

  <script type="module">
    import {
      VidstackPlayer,
      VidstackPlayerLayout,
    } from "https://cdn.vidstack.io/player";

    const isP2PSupported =
      HTMLScriptElement.supports("importmap") && Hls.isSupported();

    let HlsWithP2P;
    if (isP2PSupported) {
      const { HlsJsP2PEngine } = await import("p2p-media-loader-hlsjs");
      HlsWithP2P = HlsJsP2PEngine.injectMixin(window.Hls);
    }

    const player = await VidstackPlayer.create({
      target: "#player",
      src: "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8",
      crossOrigin: true,
      playsInline: true,
      layout: new VidstackPlayerLayout(),
    });

    player.addEventListener("provider-change", (event) => {
      const provider = event.detail;
      if (provider?.type === "hls") {
        provider.library = HlsWithP2P;
      }
    });
  </script>
</html>
```

In your project’s root pubspec.yaml, ensure that the HTML file is declared as an asset:

```yml
flutter:
  assets:
    - assets/index.html
```

**Note:** You can also host this HTML file remotely on a CDN or your own server and load it by URL.

### 3. Create a Flutter Widget with InAppWebView

Below is an example of how to create a simple widget that loads your index.html into the InAppWebView:

```dart
class MainApp extends StatelessWidget {
  const MainApp({super.key});

  void _onWebViewCreated(InAppWebViewController controller) {
    // Load the HTML file from the asset path
    controller.loadFile(assetFilePath: 'assets/index.html');

    // or Load the HTML file from URL
    // controller.loadUrl(
    //   urlRequest: URLRequest(url: WebUri('https://example.com')));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
          body: AspectRatio(
              aspectRatio: 16 / 9,
              child: InAppWebView(
                initialSettings: InAppWebViewSettings(
                  javaScriptEnabled: true,
                  allowsInlineMediaPlayback: true,
                  allowUniversalAccessFromFileURLs: true,
                  mediaPlaybackRequiresUserGesture: false,
                ),
                onWebViewCreated: _onWebViewCreated,
              ))),
    );
  }
}
```

### 4. Test P2P with other peers

After integrating the P2P Media Loader into your Flutter application, it's crucial to verify that the peer-to-peer connections are functioning as intended.

The simpliest way to test is to run the flutter application on a real device and open our [demo](https://novage.com.ua/p2p-media-loader/demo) with same url.

**Steps to debug the WeView**

When integrating P2P Media Loader within a WebView, debugging is essential to identify and resolve any issues that may arise. Below are the steps to enable and perform debugging for both Android and iOS platforms.

In the HTML files you can set up logging. To be able to see logs:
update initialSettings of InAppWebView:

```dart
  InAppWebView(
    // ... prev params
    isInspectable: true,
    ),
```

1. Android Debug steps:
   When the app is running open chrome with url chrome://inspect. Choose the webview to inspect
2. iOS Debug steps:
   When the app is running open safari:

**For a more extensive example that gathers P2P engine stats and manages P2P state according to app lifecycle, see our [P2P Media Loader Flutter Demo](https://github.com/Novage/p2p-media-loader-flutter-demo)**

# Native Android (Kotlin)

In this section, we introduce our [Kotlin library](https://github.com/Novage/p2p-media-loader-mobile) designed to leverage the capabilities of [P2P Media Loader](https://github.com/novage/p2p-media-loader) and WebRTC for efficient peer-to-peer streaming.

Our native Android library is crafted in Kotlin and is fully compatible with [ExoPlayer](https://exoplayer.dev/), one of the most popular media players for Android. The library is also designed to support other media players with minimal adjustments.

How the library works?

Inside the library we launch embedded server that will respond on players request. To setup P2P Media Loader we decided to use a WebView without binding to a view. The approach with WebView allows us to maintain the same codebase across different platforms. Moreover, with our approach there is no need to write custom WebRTC implementation for Native Android, since in WebView we already have WebRTC. This means that our WEB integration of P2P Media Loader is fully compatible with Native Android integration, as a result consumers may have a bigger mesh of peers to efficiently transfer traffic between each other.

**Note:** The library is in development, so the API might be changed by the time.

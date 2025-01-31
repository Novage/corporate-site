---
canonicalURL: https://novage.com.ua/blog/setting-up-P2P-video-in-mobile-app-for-free
author: Dmytro Demchenko
date: "2025-01-29"
title: "Integrate P2P Video streaming into Mobile Applications: Native Android and Flutter Approaches"
description: "In this article you can find ways how to set up Mobile P2P Video streaming"
---

In today’s digital age, video streaming has become an integral part of mobile applications, from social media platforms to on-demand entertainment services. However, delivering high-quality video content efficiently and cost-effectively remains a significant challenge. Traditional Content Delivery Networks (CDNs) often incur substantial bandwidth costs and can struggle with scalability as your user base grows.

Enter Peer-to-Peer (P2P) Streaming Technology. Leveraging the power of WebRTC and peer-to-peer connections, [P2P Media Loader](https://github.com/novage/p2p-media-loader) offers an efficient approach to video streaming. By enabling users to share video data directly with each other, P2P Media Loader reduces reliance on CDNs, leading to lower bandwidth costs, enhanced streaming performance, and improved scalability—crucial benefits as more users access content via mobile devices.

**Important Note:** P2P (WebRTC) may not connect to the outer world if it runs on Android emulators due to its virtual machine [network configuration](https://developer.android.com/studio/run/emulator-networking) (NAT). Please test P2P connectivity on real devices.

## Native Android (Kotlin)

**Pros:**

- **Seamless Integration with Android Ecosystem:** Direct access to Android-specific APIs and features, enabling more comprehensive customization and functionality.
- **Better Control Over Media Playback:** Utilizing libraries like ExoPlayer offers robust control over media streaming, buffering, and caching mechanisms.
- **Access to Latest Android Features:** Native development ensures immediate access to the latest Android platform updates and features without waiting for framework support.

**Cons:**

- **Platform-Specific:** The native approach is limited to Android.
- **Dependency on WebView:** Integrating P2P via WebView may introduce potential performance bottlenecks.

In this section, we introduce our [Kotlin library](https://github.com/Novage/p2p-media-loader-mobile) designed to leverage the capabilities of [P2P Media Loader](https://github.com/novage/p2p-media-loader) and WebRTC for efficient peer-to-peer streaming.

Our native Android library is crafted in Kotlin and is fully compatible with [ExoPlayer](https://exoplayer.dev/), one of the most popular media players for Android. The library is also designed to support other media players with minimal adjustments.

**How the library works?**

![Kotlin Library Architecture](../../assets/kotlin-diagram.png)

Inside the library we launch embedded server that will respond on players request. To setup P2P Media Loader we decided to use a WebView without binding to a view. The approach with WebView allows us to maintain the same codebase across different platforms. Moreover, with our approach there is no need to write custom WebRTC implementation for Native Android, since in WebView we already have WebRTC. This means that our WEB integration of P2P Media Loader is fully compatible with Native Android integration, as a result consumers may have a bigger mesh of peers to efficiently transfer traffic between each other.

**Note:** The library is in development, so the API might be changed by the time.

### 1. Add JitPack to Your Project

To include the P2P Media Loader Mobile library, first, configure **dependencyResolutionManagement** in your **settings.gradle** file:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven(url = "https://jitpack.io")
    }
}
```

### 2. Add the Library Dependency

Add the following implementation line to your **build.gradle** (app module):

```kotlin
implementation("com.github.Novage:p2p-media-loader-mobile:main-SNAPSHOT")
```

### 3. Configure the AndroidManifest

Ensure that your app has the necessary permissions and configurations by updating the **AndroidManifest.xml** file:

```xml
    <!-- Add internet access permission -->
    <uses-permission android:name="android.permission.INTERNET" />
```

### 4. Allow Localhost Connections

Create or update the **res/xml/network_security_config.xml** file to allow localhost connections:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">127.0.0.1</domain>
    </domain-config>
</network-security-config>
```

Make sure to reference this file in the **<application>** tag of your **AndroidManifest.xml**.

### 5. Use the Library

Below is a simple example that illustrates how to integrate P2P with ExoPlayer:

```kotlin
class MainActivity : ComponentActivity() {
    companion object {
        // URL to the media manifest
        private const val MANIFEST_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

        // JSON configuration for P2P Media Loader
        // See https://novage.github.io/p2p-media-loader/docs/v2.1.0/types/p2p-media-loader-core.CoreConfig.html
        private const val CORE_CONFIG_JSON = "{\"swarmId\":\"TEST_KOTLIN\"}"

        // Port on which the P2P server will run
        private const val SERVER_PORT = 8081
    }

    private lateinit var exoPlayer: ExoPlayer
    private lateinit var p2pml: P2PMediaLoader

    // State variables to manage UI state
    private val isLoading = mutableStateOf(true)
    private val videoTitle = mutableStateOf("Loading Video...")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize ExoPlayer
        exoPlayer = ExoPlayer.Builder(this).build()

        // Initialize P2P Media Loader with callbacks
        p2pml = P2PMediaLoader(
            onP2PReadyCallback = { initializePlayback() },
            onP2PReadyErrorCallback = { onP2PReadyErrorCallback(it) },
            coreConfigJson = CORE_CONFIG_JSON,
            serverPort = SERVER_PORT,
        )

        // Event listeners for P2P Media Loader
        p2pml.addEventListener(CoreEventMap.OnPeerConnect) { params ->
            // Implement logic to handle peer connection
            Log.d("P2PML", "Peer connected: ${params.peerId} - ${params.streamType}")
        }

        p2pml.addEventListener(CoreEventMap.OnSegmentLoaded) { params ->
            // Implement logic to handle loaded segment
            Log.d("P2PML", "Segment loaded: ${params.segmentUrl} - ${params.bytesLength} - ${params.downloadSource}")
        }

        p2pml.addEventListener(CoreEventMap.OnChunkDownloaded) { params ->
            // Implement logic to handle downloaded chunk
            Log.d("P2PML", "Chunk downloaded: ${params.bytesLength} - ${params.downloadSource} - ${params.downloadSource}")
        }

        // Start P2P Media Loader with the activity context and ExoPlayer instance
        p2pml.start(this, exoPlayer)

        // Listener to update UI based on playback state
        exoPlayer.addListener(object : Player.Listener {
            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_READY) {
                    isLoading.value = false
                    videoTitle.value = "Big Buck Bunny"
                }
            }
        })

        // Set the Compose UI content
        setContent {
            ExoPlayerScreen(
                player = exoPlayer,
                videoTitle = videoTitle.value,
                isLoading = isLoading.value,
            )
        }
    }

    private fun initializePlayback() {
        val manifest = p2pml.getManifestUrl(MANIFEST_URL)

        val httpDataSource = DefaultHttpDataSource.Factory()
            .setReadTimeoutMs(15000) // Read timeout
            .setConnectTimeoutMs(15000) // Connect timeout

        val mediaItem = MediaItem.fromUri(manifest)
        val mediaSource = HlsMediaSource.Factory(httpDataSource)
            .createMediaSource(mediaItem)

        exoPlayer.apply {
            playWhenReady = true
            setMediaSource(mediaSource)
            prepare()
        }
    }

    private fun onP2PReadyErrorCallback(error: String) {
        // Implement error handling logic here
    }

    override fun onStop() {
        super.onStop()
        // Disable P2P features when the activity stops
        // See https://novage.github.io/p2p-media-loader/docs/v2.1.0/types/p2p-media-loader-core.DynamicCoreConfig.html
        p2pml.applyDynamicConfig("{\"isP2PDisabled\": true}")
    }

    override fun onRestart() {
        super.onRestart()
        // Re-enable P2P features when the activity restarts
        // See https://novage.github.io/p2p-media-loader/docs/v2.1.0/types/p2p-media-loader-core.DynamicCoreConfig.html
        p2pml.applyDynamicConfig("{\"isP2PDisabled\": false}")
    }

    override fun onDestroy() {
        super.onDestroy()
        // Release ExoPlayer resources and stop P2P Media Loader
        exoPlayer.release()
        p2pml.stop()
    }
}
```

More examples are available in the library [repository](https://github.com/Novage/p2p-media-loader-mobile)

## Flutter Integration

**Pros:**

- **Cross-Platform Capability:** Write once, deploy on both Android and iOS, reducing development time and effort for multi-platform support.

**Cons:**

- **Dependency on WebView:** Integrating P2P via WebView may introduce potential performance bottlenecks.

The Flutter integration approach uses a **WebView** that contains a video player with P2P Media Loader integration. Below is a more detailed breakdown for clarity and maintainability:

To setup a video player with P2P Media Loader using webview you need:

### 1. Add the WebView Dependency

We'll use [InAppWebView](https://inappwebview.dev/docs/webview/in-app-webview/) in our Flutter example. Update your **pubspec.yaml** with:

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
                  // Enable to debug WebView
                  isInspectable: true,
                ),
                onWebViewCreated: _onWebViewCreated,
              ))),
    );
  }
}
```

**For a more extensive example that gathers P2P engine stats and manages P2P state according to app lifecycle, see our [P2P Media Loader Flutter Demo](https://github.com/Novage/p2p-media-loader-flutter-demo)**

## Testing P2P with Other Peers

After integrating the P2P Media Loader into your Flutter application, it's crucial to verify that the peer-to-peer connections are functioning as intended.

The simpliest way to test is to run the application with integrated P2P on a real device and open our [demo](https://novage.com.ua/p2p-media-loader/demo) with same manifest url.

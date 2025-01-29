---
canonicalURL: https://novage.com.ua/blog/setting-up-P2P-video-in-mobile-app-for-free
author: Dmytro Demchenko
date: "2025-01-29"
title: "Integrating P2P Video streaming into Mobile Applications: Flutter and Native Android Approaches"
description: "In this article you can find ways how to set up Mobile P2P Video streaming"
---

In the world of video streaming, low cost and q content delivery is a top priority. Our library [P2P Media Loader](https://github.com/novage/p2p-media-loader) offers an efficient way to reduce the load on traditional CDNs by leveraging peer-to-peer connections. With more users viewing content on mobile devices, integrating P2P Media Loader into mobile apps can significantly improve streaming performance and scalability.

We found a way how to integrate the library into mobile application without maintaining and supporting a lot of different code for different platforms. We wanted to have same codebase for all platforms and we successfully managed to do it.
Both Approaches provided in the article are fully compatible with WEB P2P Media Loader integration. It means that users form browser will share the traffic with mobile users and in reverse.

If you want to test any of approaches keep in mind that ⚠️ P2P (WebRTC) may not connect to the outer world if it runs on Android emulators due to its virtual machine network configuration (NAT). Please test P2P connectivity on real devices. ⚠️

# 1. Flutter Integration

So the Flutter integration is about starting a webview with a player inside it.

So we need to have a html file with a player on full width of the screen, also we need to setup p2p media loader in our html file. In flutter we need to setup inappwebview controller and load the file.

You can check code example in our github repository
Here is a screenshot of our demo:

<img src="/images/flutter_demo_example.jpg" alt="Flutter Demo Example" style="margin: 0 auto; height: 600px;"/>

# 2. Native Android (Kotlin)

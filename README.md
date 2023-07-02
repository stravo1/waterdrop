# <sub><img src="public/favicon.png" width="30" ></sub> [waterdrop](https://waterdrop.vercel.app)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/stravo1/waterdrop) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/stravo1/waterdrop) ![GitHub last commit](https://img.shields.io/github/last-commit/stravo1/waterdrop) ![Website](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Fwaterdrop.vercel.app%2F)

a platform independent, peer-to-peer, browser based alternative to AirDrop.
transfer texts, links and files across devices **in the same network.** you just need a browser ;)

#### highlights:

- no sign-ups required
- totally platform independent
- supports clipboard access for text transfer
- clean, minimal interface
- typescript <3

#### dependencies:

- svelte: the main compiler
- tailwind css: styling framework
- vite: the build tool
- socket.io: WebRTC signalling server implementation
- [peer-lite](https://github.com/skyllo/peer-lite): easy to use lightweight WebRTC browser library

> [waterdrop-server](https://www.github.com/stravo1/waterdrop-server) is the NodeJS server component for this web app. although the transfers occur in a P2P manner but the initial connection and discovery of devices (on the same network) requires a server
>
> read more about WebRTC [here](https://webrtc.org/)

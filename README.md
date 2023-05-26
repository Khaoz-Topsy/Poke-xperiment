<div align="center">
  
  # Pok-é-xperiment
  ### A silly little experiment to make web based (Poké*** look-a-like)  
  ![header](https://raw.githubusercontent.com/Khaoz-Topsy/Poke-xperiment/main/.github/header.svg?raw=true)
  
  <br />
  
  ![madeWithLove](https://raw.githubusercontent.com/Khaoz-Topsy/Khaoz-Topsy/master/.github/made-with-love.svg)
  [![licence](https://raw.githubusercontent.com/Khaoz-Topsy/Khaoz-Topsy/master/.github/licence-badge.svg)](https://github.com/AssistantDKM/.github/blob/main/LICENCE.md)
  [![gitmoji](https://raw.githubusercontent.com/Khaoz-Topsy/Khaoz-Topsy/master/.github/gitmoji.svg?raw=true)](https://gitmoji.dev)<br />
  ![Profile views](https://komarev.com/ghpvc/?username=Khaoz-Topsy&color=green&style=for-the-badge)

  [![Mastodon](https://img.shields.io/mastodon/follow/109315859662532146?color=%2300ff00&domain=https%3A%2F%2Fnomanssky.social&style=for-the-badge&logo=mastodon)][mastodon]
  [![Discord](https://img.shields.io/discord/625007826913198080?style=for-the-badge&label=Chat%20on%20Discord&logo=discord)][discord]<br />
  [![Follow on Twitter](https://img.shields.io/badge/follow-%40AssistantNMS-1d9bf0?logo=twitter&style=for-the-badge)][assistantnmsTwitter]<br />
  
  <br /> 
</div>
 
## 😲 Why?

I grew up with the top down pokemon games like [Pokemon Emerald](https://bulbapedia.bulbagarden.net/wiki/Pokémon_Emerald_Version) and I wanted to bring the experience of walking around the world to the web (in probably the least efficient way).

## 🧪 Experiments

- Layering simple sprites on a "map" to create the world
  - e.g. There are grass tiles as the background and items like houses and plants that the player walks in front of. There are also situations where the player can go behind objects which creates the perception of a 3D world represented in a 2D way
- Loading and using a "Sprite map"
  - Basically one large image with all items and then either using parts of that image or cutting out the image pieces on the front-end
- Tools for creating the levels
  - Level builder: Manage placing items, layers, interactions, etc
  - Sprite mapper: Easy way to mark where a sprite item starts and ends
- Exporting a SolidJS project to a WebComponent using [Solid Element](https://www.npmjs.com/package/solid-element)
  - I had the idea of exporting this "game" as a webcomponent a bit late, otherwise I would have written it in something more appropriate like Svelte or Lit 😅

---

## 🥅 Goals

- Have a working "game"
- Have this as a fun widget on my CV site
- Have relatively easy tools to make this "game" _(for both myself and others to use)_

---

## 🏃‍♂️ Running the project
  
### Requirements
- NodeJS (16+)

### Steps:
1. Clone this repository
2. `npm i`
3. `npm run dev`
4. Go to https://localhost:3000


<!-- Links used in the page -->

[kurtGithub]: https://github.com/Khaoz-Topsy?ref=Ass[[](https://github.com/AssistantDKM/.github/blob/main)](https://github.com/AssistantDKM/.github/blob/main)Github
[assistantAppsTools]: https://tools.assistantapps.com?ref=AssistantDKMGithub
[website]: https://assistantapps.com/dkm?ref=AssistantDKMGithub
[webapp]: https://dinkum.assistantapps.com?ref=AssistantDKMGithub
[assistantnmsTwitter]: https://twitter.com/AssistantNMS?ref=AssistantDKMGithub
[discord]: https://assistantapps.com/discord?ref=AssistantDKMGithub
[mastodon]: https://nomanssky.social/@assistantnms?ref=AssistantDKMGithub
[nmscd]: https://github.com/NMSCD?ref=AssistantDKMGithub

<!-- Other -->
[mbincompiler]: https://github.com/monkeyman192/MBINCompiler
[flutter]: https://docs.flutter.dev/get-started/install
[androidStudio]: https://developer.android.com/studio
[codeMagic]: https://codemagic.io


<div align="center">

# Marauder’s Atlas · 活点地图

### Unfold Hogwarts on a sheet of weathered paper.

Ink that awakens. Footprints that wear away. Stories you can follow from one place to another.

**3 map volumes · 50 location records · 3 eras · Vanilla HTML / CSS / JavaScript / SVG**

[简体中文](README.md) · [Quick start](#quick-start) · [Behind the map](#behind-the-map) · [Share the project](docs/SHARE.md)

[![Static checks](https://github.com/zsy-smu/marauders-atlas/actions/workflows/check.yml/badge.svg)](https://github.com/zsy-smu/marauders-atlas/actions/workflows/check.yml)
[MIT code license](LICENSE) · No framework · No build step · No third-party runtime dependencies

</div>

![Hogwarts and its grounds, illustrated in an engraved style on aged paper](docs/images/grounds.jpg)

> “I solemnly swear that I am up to no good.”
>
> Open the folded map, watch the ink emerge, and follow a familiar name into a story. Find the One-Eyed Witch on the third floor, turn to the Honeydukes cellar record, then find your way back.

Marauder’s Atlas is an unofficial Harry Potter fan project: part interactive map, part illustrated gazetteer. **The app interface and location records are in Chinese; this English README introduces the experience and codebase.**

## Small details worth getting lost in

**Paper with a past.** Fibres, stains, print-through, folds and uneven edges sit beneath engraved-style artwork. Ink emerges through a noise mask; the imagery is blended into the paper rather than simply placed on a beige background.

**Footprints that stay where they land.** Left and right shoes alternate by travelled distance. Old impressions remain fixed, then erode through eight wear stages. Pause the map and even the ageing of old ink pauses with it.

**Passages that connect stories.** Move between the One-Eyed Witch and Honeydukes records, or compare the tapestry near the Trophy Room with the Charms corridor. The archive links and map overlays share the same connection data.

**Time with consequences.** On the fourth floor, compare a conjectural earlier view of the mirror passage with its known collapsed state. Unknown exits stay unknown; the Room of Requirement remains a map blind spot.

## Three volumes to explore

| Volume | What you can find |
| --- | --- |
| **I · School & Grounds** | Castle, lake, forest, Willow, hut, greenhouses, pitch and station; 14 records |
| **II · Within the Castle** | 10 floor groups and 24 records; independently designed third- and fourth-floor guide plans |
| **III · Hogsmeade** | Sweet shops, pubs, quills, post and secrets beyond the village; 12 records |

![The Hogsmeade companion map](docs/images/hogsmeade.jpg)

<table>
  <tr>
    <td width="50%"><img src="docs/images/third-floor.jpg" alt="Third floor: statue alcove, display gallery and tapestry shortcut"><br><strong>Third floor · Statues & tapestries</strong><br>A distinct guide layout and clues that continue into another volume.</td>
    <td width="50%"><img src="docs/images/fourth-floor.jpg" alt="Fourth floor: library shelves, reading tables, Restricted Section and mirror passage"><br><strong>Fourth floor · Pages & old passages</strong><br>A rope-separated Restricted Section and a route whose history matters.</td>
  </tr>
</table>

## Your first little expedition

1. Touch the cover oath to reveal the ink.
2. Find the One-Eyed Witch on the third floor. Follow the archive link to Honeydukes, then return.
3. Explore the tapestry shortcut and its two records.
4. Visit the fourth-floor library, then compare the mirror passage’s era layers.
5. Zoom into the footprints, pause their fading, and finish with “Mischief managed.”

This is a suggested reading route, not a quest or reward system. Chinese labels guide the in-app interactions.

## Built for smaller screens, too

Mobile navigation uses a location directory and a lower-screen archive. Labels adapt to screen scale, comparison controls leave room for the map, and reduced-motion preferences are respected.

<p align="center"><img src="docs/images/fourth-floor-era.jpg" width="300" alt="Mobile era comparison, with the map and evidence boundary visible together"></p>

## Quick start

With **Node.js 20+**, run these three commands. **No `npm install` is required.**

```sh
git clone https://github.com/zsy-smu/marauders-atlas.git
cd marauders-atlas
npm start
```

Open the printed address, normally `http://127.0.0.1:4173`. Local preview needs no account, API key or backend service. You can also [download the source ZIP](https://github.com/zsy-smu/marauders-atlas/archive/refs/heads/main.zip).

Or serve the static files with Python:

```sh
python -m http.server 4173 --directory dist
```

The [hosted version](https://marauders-map-cn.zsiyuan202.chatgpt.site/) is subject to its access policy; **it is not advertised as an unrestricted public demo**. The source runs independently. This documentation update does not change hosting permissions.

| Control | Action |
| --- | --- |
| Landmark or directory entry | Locate a place and open its record |
| `/` | Search places, character references and passages |
| Drag, wheel or pinch | Pan and zoom |
| `+`, `-`, `0` | Zoom in, zoom out, fit the map |
| `Esc` | Close the current panel or comparison; otherwise fold the map |

## Craft you can inspect

- **Shared geometry:** rendered floor plans and walking routes use the same coordinates.
- **Bounded animation:** planted impressions, a fixed stamp pool and progressive wear masks.
- **Connected navigation:** cross-volume records, era comparisons and keyboard focus restoration.
- **Explicit checks:** `npm run check` covers syntax, data, assets, animation and routes. The current route check samples 92,475 positions across 10 floor groups × 3 eras, including conservative clearance for both shoes.

These checks establish internal consistency, not canonical geography or exhaustive real-device compatibility.

## A map that knows its limits

Records prioritise the novels and official Harry Potter material, with the unofficial Harry Potter Lexicon used as a chapter-index aid. Each record links to source material.

- The 50 records include cross-volume references, not 50 wholly distinct locations.
- Only the third and fourth floors currently have independent layouts; eight groups retain a shared guide template. None is an official architectural blueprint.
- The three eras select illustrative character groups and record states, not complete historical simulations. The 1976 mirror view is conjectural, not proof the tunnel was usable then.
- Hogsmeade is a companion gazetteer, without village character tracking. Footsteps are illustrative rather than live or canonical event replays.
- The large map backgrounds are generated illustrations, not official scans. Labels, hotspots and movement are separate layers; asset origins and rights are documented.

## Behind the map

The detailed making-of notes are currently in Chinese:

- [Artwork, texture and image prompts](docs/ARTWORK.md)
- [Ink reveal, name scrolls and footprint erosion](docs/ANIMATION.md)
- [Third-floor connections](docs/THIRD-FLOOR.md)
- [Fourth-floor library and evidence-aware comparison](docs/FOURTH-FLOOR.md)
- [Readability and route checks](docs/READABILITY-AND-ROUTES.md)
- [Lore sources and boundaries](docs/LORE.md)

Screenshots document different production stages; the floor and mobile images above show the recent independent layouts and comparison UI.

<details>
<summary><strong>Source, checks and deployment</strong></summary>

```text
dist/       Static app: markup, styles, data, SVG plans and interaction
scripts/    Dependency-free preview server and three check scripts
docs/       Making-of notes, source boundaries and real screenshots
```

```sh
npm run check
```

Start with `dist/data.js` for records and `dist/art.js` for rooms, furniture and routes. Serve `dist/` as the web root. The optional GitHub Pages workflow is manually triggered; a source push runs checks but does not automatically publish a public site. See [GitHub’s deployment documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

</details>

## Pass the map along

If you enjoy Harry Potter, illustrated maps or expressive vanilla frontend work, a **Star** helps other curious explorers find this project. Share it with someone who would happily spend another evening wandering Hogwarts.

[Issues](https://github.com/zsy-smu/marauders-atlas/issues) and contributions are welcome—especially chapter-backed corrections, spatial evidence and real-device readability feedback. [Ready-to-use sharing copy](docs/SHARE.md) is included.

## License & acknowledgements

Code and project documentation use the [MIT License](LICENSE). Asset provenance, inspiration, generated illustrations and existing rights are explained in [third-party notices](THIRD_PARTY_NOTICES.md) and [artwork notes](docs/ARTWORK.md).

This is an unofficial fan project, not affiliated with or endorsed by the rights holders. The code license does not grant rights to Harry Potter characters, names, settings or other existing intellectual property.

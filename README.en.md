![Hogwarts grounds, lake, forest and character footprints](docs/images/grounds.jpg)

# Marauder’s Atlas · 活点地图

An interactive Hogwarts map with location records, illustrated floor plans and moving footprints. An unofficial fan project built with vanilla JavaScript and SVG. **The app interface and records are in Chinese.**

[简体中文](README.md) · [Download source](https://github.com/zsy-smu/marauders-atlas/archive/refs/heads/main.zip) · [Run locally](#run-locally) · [Making-of notes](#making-of-notes)

[![Static checks](https://github.com/zsy-smu/marauders-atlas/actions/workflows/check.yml/badge.svg)](https://github.com/zsy-smu/marauders-atlas/actions/workflows/check.yml)

**3 map volumes / 50 location records / 10 floor groups / 3 eras**

There is currently no confirmed unrestricted public demo. The [hosted version](https://marauders-map-cn.zsiyuan202.chatgpt.site/) has access restrictions; the source runs independently.

## Things to try

Open the cover to reveal the ink. Pan and zoom, then select a building or directory entry to read its record. Switch between the grounds, castle and Hogsmeade; linked passage records let you visit both ends.

- **Look for Filch.** The 1993–94 character group includes an illustrative patrol. Left and right footprints stay where they land, then gradually wear away. Pausing also stops their fading.
- **Find the Room of Requirement.** Its marker remains a question mark, and its record explains why the map cannot reveal the people inside.
- **Compare passage records across eras.** The mirror passage is marked as collapsed in 1993–94. Its 1976 view is conjectural, not evidence of access that year. The 1998 records also include the Ariana portrait passage.
- **Follow the One-Eyed Witch to Honeydukes.** The third-floor record links to the cellar record in the Hogsmeade volume, with a link back.

Character routes are illustrative animations, not canonical event replays. Hogsmeade is a companion gazetteer without village character tracking.

## The maps

| Volume | Contents |
| --- | --- |
| Grounds | Castle, lake, forest, Willow, Hagrid’s hut, greenhouses, pitch, station and more; 14 records |
| Castle | 10 floor groups, from dungeons to towers; 24 records |
| Hogsmeade | Honeydukes, the Three Broomsticks, the Hog’s Head, quill shop, post office and more; 12 records |

![Hogsmeade map](docs/images/hogsmeade.jpg)

The third and fourth floors have their own layouts. The third includes a statue alcove, display gallery and tapestry clues; the fourth includes library shelves, reading tables, the Restricted Section and mirror passage. The other eight floor groups still share a guide layout.

<table>
  <tr>
    <td width="50%"><img src="docs/images/third-floor.jpg" alt="Third-floor statue alcove, gallery and tapestry shortcut"><br>Third floor: the One-Eyed Witch and tapestry clues</td>
    <td width="50%"><img src="docs/images/fourth-floor.jpg" alt="Fourth-floor library, Restricted Section and mirror passage"><br>Fourth floor: the library and mirror passage</td>
  </tr>
</table>

On phones, a directory helps locate places and records open in a separately scrolling lower panel. This screenshot shows the fourth-floor era comparison:

<p align="center"><img src="docs/images/fourth-floor-era.jpg" width="300" alt="Fourth-floor era comparison on a phone-sized screen"></p>

## Implementation

The paper uses an aged newsprint texture with fibres, stains, folds and print-through. Blend layers integrate the illustrations and ink. The two large backgrounds are generated illustrations, not official map scans; labels, hotspots, routes and characters are separate layers.

The ink reveal uses an SVG noise mask. Footprints alternate by travelled distance, wear through eight mask stages and reuse a fixed pool of nodes. Floor drawings and walking routes share coordinates.

The app is static HTML, CSS, JavaScript and SVG: no framework, build step or third-party runtime dependencies.

## Run locally

With Node.js 20 or newer:

```sh
git clone https://github.com/zsy-smu/marauders-atlas.git
cd marauders-atlas
npm start
```

No `npm install` is needed. Open the printed address, normally `http://127.0.0.1:4173`. No account, API key or backend is required. You can also download the source ZIP above and run `npm start` in the extracted directory.

Or use Python:

```sh
python -m http.server 4173 --directory dist
```

Drag, scroll or pinch to navigate. Use `/` to search, `+` / `-` / `0` to adjust the view, and `Esc` to close the current panel or fold the map. Footprint, passage and pause controls are available. System reduced-motion preferences are respected.

<details>
<summary>Source, checks and deployment</summary>

```text
dist/       Static app, records, SVG plans and assets
scripts/    Preview server and checks
docs/       Making-of notes, sources and screenshots
```

Start with `dist/data.js` for records, `dist/art.js` for floor geometry and routes, and `dist/app.js` for interaction.

```sh
npm run check
```

Checks cover scripts, records, assets, animation and routes. The route check currently samples 92,475 positions across 10 floor groups × 3 eras, including clearance for both shoes. This tests internal consistency, not canonical geography or exhaustive real-device compatibility.

Serve `dist/` as the site root. A manually triggered Pages workflow is included: select GitHub Actions under Settings → Pages, then run Actions → Deploy GitHub Pages. It uploads `dist/`; source pushes do not automatically publish a site. Branch-based Pages publishing only accepts the root or `/docs`, not `/dist`. See [GitHub’s documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

</details>

## Sources and limitations

Records prioritise the seven novels and official HarryPotter.com / J.K. Rowling material, with the unofficial Harry Potter Lexicon used to help locate chapters. Each record includes story references and source links. Corrections with chapter references are welcome in [Issues](https://github.com/zsy-smu/marauders-atlas/issues).

The 50 records include cross-volume references, not 50 wholly distinct locations. Floor plans are guide illustrations, not official architectural blueprints. The eras select character groups and record states, rather than simulating complete historical scenes.

Further work focuses on independent layouts for the remaining floors, checking spatial evidence and testing readability on real phones.

## Making-of notes

The detailed notes are in Chinese:

- [Texture, illustrations and image prompts](docs/ARTWORK.md)
- [Ink reveal and footprint animation](docs/ANIMATION.md)
- [Third-floor layout and connections](docs/THIRD-FLOOR.md)
- [Fourth-floor library and era comparison](docs/FOURTH-FLOOR.md)
- [Mobile readability and route checks](docs/READABILITY-AND-ROUTES.md)
- [Lore sources](docs/LORE.md)
- [Sharing copy and images](docs/SHARE.md)

## License

Code and project documentation use the [MIT License](LICENSE). Asset provenance and reference projects are listed in [third-party notices](THIRD_PARTY_NOTICES.md) and [artwork notes](docs/ARTWORK.md).

This is an unofficial Harry Potter fan project, not affiliated with or endorsed by the rights holders. The code license does not grant rights to existing characters, names, settings or other intellectual property.

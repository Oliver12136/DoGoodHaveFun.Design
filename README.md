# DoGoodHaveFun.Design

**A global map of social design work and academic research labs.**

Browse it live at **[dogood.oghuzhan.work](https://dogood.oghuzhan.work)**

---

## What it is

Two interconnected maps for people looking to do meaningful design work:

- **[Social Design Jobs](https://dogood.oghuzhan.work)** — studios, civic labs, NGOs, climate consultancies, and community collectives with open roles in social impact design, around the world.
- **[Academic Research Labs](https://dogood.oghuzhan.work/research)** — university research groups in HCI, interaction design, and related fields with a social, critical, or humanistic focus, spanning 30+ countries.

Both maps share the same interface: zoom, filter by category, search by name or city, switch between map and list view, and click any point to see the full profile and open opportunities.

---

## Why a globe?

This project uses a globe-first map because representation matters.

Flat world maps are never neutral: every projection involves distortion. Some of the most familiar projections — especially Mercator-style world maps — enlarge regions closer to the poles and make equatorial regions appear relatively smaller. As a result, Africa is often visually reduced compared to its true size, in a way many people have simply grown used to.

Using a globe helps preserve a more truthful sense of scale and reminds us that the world is not flat, centered, or proportioned in only one way. When users zoom in, the globe gradually becomes a practical flat map for exploring local organizations and opportunities, while still beginning from a more balanced global perspective.

---

## Interface

- Globe-style interactive map (MapLibre GL JS + OpenFreeMap tiles)
- Filter by category, role type (role / project), track (intern / fellowship / contract / full-time), and region
- Live search by organization name, city, or country
- Map counter shows only the visible points in the current viewport
- List view for scanning without a map
- Submission form — anyone can suggest a missing organization

---

## Tech stack

| Layer | What |
|---|---|
| Frontend | React 18 (browser CDN), Babel standalone, MapLibre GL JS |
| Fonts | Inter, JetBrains Mono, Newsreader (Google Fonts) |
| Map tiles | OpenFreeMap (OpenStreetMap-based vector tiles) |
| Backend | Cloudflare Workers (ES module) |
| Database | Cloudflare D1 (SQLite-compatible) |
| Hosting | Cloudflare Workers static assets |
| Domain | `dogood.oghuzhan.work` (custom domain via Cloudflare) |

No build step — the frontend is plain JSX transpiled in the browser.

---

## Project structure

```
.
├── worker.js                         # Cloudflare Worker: API + asset routing
├── wrangler.toml                     # Cloudflare deployment config
└── socialdesignjobs/
    ├── index.html                    # Main app shell
    ├── app.jsx                       # App state, filters, routing
    ├── views.jsx                     # Map, list, and filter bar views
    ├── components.jsx                # OrgCard, Tooltip, SubmitModal
    ├── tweaks-panel.jsx              # Dev tweaks panel
    ├── styles.css                    # All styles
    ├── data.js                       # Category definitions + static fallback
    └── research/
        ├── index.html                # Academic Research map shell
        └── research-data.js          # Research categories (loaded at runtime)
```

---

## API (public)

```
GET  /api/orgs                  → all social design organizations
POST /api/submissions           → submit a new organization for review

GET  /api/research/orgs         → all academic research labs
POST /api/research/submissions  → submit a new research lab for review
```

Both submission endpoints accept JSON:

```json
{
  "name": "Organization name",
  "url": "https://...",
  "city": "City",
  "country": "Country",
  "category": "studio",
  "blurb": "One-line description",
  "jobTitle": "Role title",
  "jobUrl": "https://..."
}
```

Fields `name`, `city`, and `country` are required.

---

## Running locally

Requirements: [Node.js](https://nodejs.org/) 18+ and [Wrangler](https://developers.cloudflare.com/workers/wrangler/).

```bash
npm install -g wrangler
wrangler dev
```

The app runs at `http://localhost:8787`. To deploy:

```bash
wrangler deploy
```

---

## Data

**Social design jobs** are stored in a Cloudflare D1 database (`orgs` and `submissions` tables). Community submissions go through a review queue before appearing on the map.

**Academic research labs** are stored in a separate D1 table (`research_orgs`). The 40+ labs currently in the database were researched and manually curated from public information about active university research groups globally. Research submissions go into a separate `research_submissions` table.

Both datasets are updated manually on a regular basis.

---

## Contributing

The easiest way to contribute is through the submission form on the site — click **"some works missing?"** on either map.

If you want to contribute to the code, open an issue or pull request on this repository.

---

## License

**GNU General Public License v3.0 or later (GPL-3.0-or-later)**

I choose the GPL because I believe in **strong copyleft**: software freedom should travel with the code. Anyone is welcome to use, study, share, and modify this project, but redistributed versions and derivative works must preserve the same freedoms for downstream users under the terms of the GPL.

In practice, this means that if you distribute modified versions, forks, or works based on this project, you must do so under the GPL v3.0 or a later version, and provide the corresponding source code as required by the license.

This project is shared in support of free software, open collaboration, and a commons where improvements remain available to the community.

See the [LICENSE](./LICENSE) file for the full license text.

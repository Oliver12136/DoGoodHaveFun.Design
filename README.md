# Social Design Jobs Map

A map-first directory for early-career social design, civic technology, public innovation, sustainability, research, and nonprofit design opportunities around the world.

The project combines a globe-style interactive job map with a lightweight submission and admin review backend. It is designed as a focused tool for discovering organizations, browsing open roles, and maintaining a curated jobs dataset without needing a full CMS.

## Highlights

- Globe-style MapLibre interface with OpenStreetMap-based vector tiles
- Job-level map points, with more positions revealed as users zoom in
- Fast touchpad and mobile pinch interactions tuned for map-first browsing
- Mobile-first layout with filters collapsed by default
- Search, category, role type, track, and region filters
- Submission form for community-suggested organizations and jobs
- Admin review queue for approving or rejecting submissions
- Lightweight Node.js backend with a JSON data store

## Tech Stack

- React 18 via browser scripts
- MapLibre GL JS for the interactive globe map
- OpenFreeMap / OpenStreetMap-based vector map style
- Node.js HTTP server
- JSON-backed data storage
- Plain HTML, CSS, and JavaScript

## Project Structure

```text
.
├── server.js                         # Static server and JSON API
├── package.json                      # Node scripts
├── data/
│   └── socialdesignjobs.json         # Runtime jobs and submissions database
└── socialdesignjobs/
    ├── index.html                    # Main app shell
    ├── app.jsx                       # App state, filters, API integration
    ├── views.jsx                     # Map, list, and filter views
    ├── components.jsx                # Shared UI components
    ├── styles.css                    # App and admin styling
    ├── admin.html                    # Admin review page
    ├── admin.js                      # Admin queue logic
    └── data.js                       # Static fallback dataset
```

## Getting Started

Requirements:

- Node.js 18 or newer

Install and run:

```bash
npm start
```

Then open:

```text
http://localhost:4173/socialdesignjobs/
```

If port `4173` is already in use, the server automatically tries the next available port and prints the final URL.

## Admin Access

For local development, the default admin token is:

```text
jobmap2024
```

For production, set a strong token explicitly:

```bash
ADMIN_TOKEN="your-long-random-token" NODE_ENV=production npm start
```

The admin page is available at:

```text
http://localhost:4173/admin
```

## API

Public endpoints:

- `GET /api/health`
- `GET /api/orgs`
- `POST /api/submissions`

Admin endpoints:

- `GET /api/submissions?status=pending`
- `PATCH /api/submissions/:id`
- `GET /api/admin/orgs`
- `DELETE /api/admin/orgs/:id`
- `DELETE /api/admin/orgs/:id/jobs/:jobIndex`

Admin requests require the `x-admin-token` header or a `token` query parameter.

## Data Model

The main database lives in `data/socialdesignjobs.json` and contains:

- `orgs`: approved organizations and their job listings
- `submissions`: pending, approved, or rejected community submissions
- `meta`: public update metadata shown in the app banner

The browser also includes `socialdesignjobs/data.js` as a static fallback dataset when the API is unavailable.

The admin screen can review submissions, delete existing organizations, or remove individual job points from the map.

## Deployment Notes

This app can run anywhere Node.js is available. For production:

- Set `NODE_ENV=production`
- Set a strong `ADMIN_TOKEN`
- Back up `data/socialdesignjobs.json`
- Avoid committing real private submissions or secrets
- Put the server behind HTTPS if deployed publicly

## License

This project is licensed under the GNU General Public License v3.0 or later.

You may redistribute and/or modify this project under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.

See the [LICENSE](./LICENSE) file for details.

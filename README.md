My Office Setup — Static Site
=================================

A super‑simple static site to showcase your office gear. No build step, just edit JSON and push.

Structure
---------

- `docs/`: the entire public site (for GitHub Pages from `main` → `docs/`).
- `docs/index.html`: layout, search, and tag filter UI.
- `docs/items.json`: your gear list — edit this file.
- `docs/assets/`: images for items (use any filenames and point `image`).

Editing Content
---------------

1. Open `docs/items.json` and add/update entries. Example item:

   {
     "name": "Keyboard",
     "brand": "Keychron",
     "model": "K6",
     "image": "assets/keychron-k6.jpg",
     "tags": ["input", "wireless"],
     "links": [
       { "label": "Product page", "url": "https://example.com" }
     ],
     "notes": "Brown switches, PBT caps."
   }

2. Drop images into `docs/assets/` and reference them via the `image` field.
3. Optional: tweak styles in `docs/styles.css` and title/meta in `docs/index.html`.

Local Preview
-------------

Open `docs/index.html` directly in your browser. If your browser blocks `fetch` of `items.json` from a `file://` URL, run a tiny local server:

- Python 3: `python3 -m http.server -d docs 5173`
- Node (if installed): `npx serve docs`

Then visit `http://localhost:5173`.

Deploy (GitHub Pages)
---------------------

Simplest path (no CI):
- In the repo on GitHub, go to Settings → Pages.
- Set Source to `Deploy from a branch`.
- Select Branch `main`, folder `/docs`.
- Save. The site will be available at `https://<you>.github.io/<repo>/`.

Custom Domain (optional)
------------------------

- In Settings → Pages, add your custom domain.
- Create a `CNAME` record pointing your domain to `<you>.github.io`.
- If you want, add a `docs/CNAME` file containing only your domain name to pin it in the repo.

Notes
-----

- The search box and tag filter work entirely client‑side.
- To change the theme default, tweak CSS variables in `docs/styles.css`.
- No dependencies or build tools required.


# NetApp x SpaceXAI

Password-protected GTM working session for NetApp. The app keeps the supplied
Next.js 15.5 source architecture, Geist fonts, vGPU hero effect, protected
route group, and private media route.

## Run locally

1. Install dependencies with `npm install`.
2. Set `SITE_PASSWORD` in `.env.local`.
3. Start the app with `npm run dev`.
4. Open `http://localhost:3000`.

The app fails closed when `SITE_PASSWORD` is missing.

## Verify the source

Run the architecture and residue check:

```bash
npm run verify:architecture
npm run lint
npm run build
```

The check holds the framework versions, the scene component chain, the
password boundary, the official wordmark hash, and the customer residue rules.

With the production server running and `SITE_PASSWORD` set, run the live
checks:

```bash
npm run verify:http
npm run verify:ui
```

The browser check uses the installed Google Chrome and writes screenshots to
`/tmp/netapp-gtm-verification`.

## Brand assets

`public/brand/netapp-wordmark.svg` is the official horizontal NetApp wordmark
from [NetApp](https://www.netapp.com). The partner mark remains the supplied
SpaceXAI asset. The hero uses the approved NetApp watercolor in
`public/brand/netapp-watercolor-header.jpg`.

## Private media

Store approved video files under `private/media`. The authenticated
`/api/media/...` route serves those files. Do not put private media in
`public`.

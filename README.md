# Horsetail Viewer

Static split-shell SOGS viewer for the Horsetail compressed bundle.

## Local development

```bash
npm install
npm run dev
```

The Vite dev server serves the repo root, and `/` redirects to `/3d/`.

## Repo structure

- `3d/`: shell app
- `supersplat-viewer/`: renderer app
- `index.html`: root redirect for GitHub Pages and local startup

## Default bundle

The shell defaults to this **meta.json** (same folder as the splat assets):

`https://spaceport-ml-processing-staging.s3.amazonaws.com/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/meta.json`

The iframe loads **`background_skybox.webp` in the same directory** as `meta.json` (see also `background_manifest.json` in that folder).

### Local dev (`npm run dev`)

`localhost` cannot fetch the staging bucket with anonymous CORS in some setups, so the dev server proxies `http://localhost:<port>/__s3-staging/...` → `https://spaceport-ml-processing-staging.s3.amazonaws.com/...`. The shell uses that path automatically on localhost.

### Staging bucket access (important)

If **GET** requests to those HTTPS URLs return XML errors about **KMS** or **Signature Version 4**, the objects are not readable by anonymous browsers yet. Fix **public read** (or **SSE-S3** instead of **SSE-KMS** for these objects), or serve the bundle via **CloudFront** with the right policy. Until then, the renderer cannot load that bundle from the web app.

Direct object URIs (for tools / AWS CLI):

- `s3://spaceport-ml-processing-staging/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/meta.json`
- `s3://spaceport-ml-processing-staging/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/background_skybox.webp`
- `s3://spaceport-ml-processing-staging/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/background_manifest.json`

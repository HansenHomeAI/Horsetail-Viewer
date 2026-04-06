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

### Staging bucket

The bucket policy allows public **`GetObject`** on `compressed/*`. Bundle objects use **SSE-S3 (AES256)** so browsers can read them without SigV4. **CORS** includes common dev origins (e.g. `http://localhost:5173`) so `npm run dev` can fetch the bundle directly.

Direct object URIs (for tools / AWS CLI):

- `s3://spaceport-ml-processing-staging/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/meta.json`
- `s3://spaceport-ml-processing-staging/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/background_skybox.webp`
- `s3://spaceport-ml-processing-staging/compressed/horsetail-sfwl-hq-skyfix-compress-20260405-011257/supersplat_bundle/background_manifest.json`

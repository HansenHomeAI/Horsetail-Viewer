# Horsetail Viewer

Static split-shell SOGS viewer for the Horsetail compressed bundle.

## Local development

```bash
npm install
npm run dev
```

The Vite dev server serves the repo root on **port 5173** (`--strictPort`), and `/` redirects to `/3d/`.

Developer tools in the shell (splat position/rotation helpers) are **on by default**. Add `?dev=0` to the URL to hide them.

## Repo structure

- `3d/`: shell app
- `supersplat-viewer/`: renderer app
- `index.html`: root redirect for GitHub Pages and local startup

## Default bundle

The shell defaults to this **meta.json** (same folder as the splat assets):

`https://spaceport-ml-processing-staging.s3.amazonaws.com/compressed/horsetail-brassmatch-compress-20260410-022221-public/supersplat_bundle/meta.json`

The iframe loads **`background_skybox.webp` in the same directory** as `meta.json` (see also `background_manifest.json` in that folder).

This branch targets the **Brass Lantern 3DGS** run on Horsetail SfM (`horsetailfull-p1f9216-1774981801/colmap`), compression job `horsetail-brassmatch-compress-20260410-022221`. Objects under the `-public` prefix use **SSE-S3 (AES256)** so browsers can read them anonymously (the raw compressor prefix used SSE-KMS).

### Staging bucket

The bucket policy allows public **`GetObject`** on `compressed/*`. **CORS** includes common dev origins (e.g. `http://localhost:5173`) so `npm run dev` can fetch the bundle directly.

Direct object URIs (for tools / AWS CLI):

- `s3://spaceport-ml-processing-staging/compressed/horsetail-brassmatch-compress-20260410-022221-public/supersplat_bundle/meta.json`
- `s3://spaceport-ml-processing-staging/compressed/horsetail-brassmatch-compress-20260410-022221-public/supersplat_bundle/background_skybox.webp`
- `s3://spaceport-ml-processing-staging/compressed/horsetail-brassmatch-compress-20260410-022221-public/supersplat_bundle/background_manifest.json`

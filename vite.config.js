import { HeadObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const SOGS_PROXY_PREFIX = "/api/sogs-proxy/";

/**
 * Inverse of `convertToProxyPath` in `3d/index.js` (base uses "https:/" instead of "https://").
 */
function decodeSogsProxyUrl(urlPath) {
  if (!urlPath.startsWith(SOGS_PROXY_PREFIX)) return null;
  let rest = urlPath.slice(SOGS_PROXY_PREFIX.length);
  const q = rest.indexOf("?");
  const query = q >= 0 ? rest.slice(q) : "";
  const pathOnly = q >= 0 ? rest.slice(0, q) : rest;
  let target = pathOnly;
  if (target.startsWith("https:/") && !target.startsWith("https://")) {
    target = "https://" + target.slice("https:/".length);
  } else if (target.startsWith("http:/") && !target.startsWith("http://")) {
    target = "http://" + target.slice("http:/".length);
  }
  try {
    return new URL(target + query);
  } catch {
    return null;
  }
}

function virtualHostedS3Params(url) {
  const host = url.hostname;
  const key = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const regional = host.match(/^([^.]+)\.s3\.([a-z0-9-]+)\.amazonaws\.com$/);
  if (regional && regional[2] !== "amazonaws") {
    return { Bucket: regional[1], Key: key, region: regional[2] };
  }
  const legacy = host.match(/^([^.]+)\.s3\.amazonaws\.com$/);
  if (legacy) {
    return { Bucket: legacy[1], Key: key, region: "us-east-1" };
  }
  return null;
}

export default {
  plugins: [
    {
      name: "sogs-s3-dev-proxy",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== "GET" && req.method !== "HEAD") {
            return next();
          }
          const pathOnly = req.url.split("?")[0].split("#")[0];
          if (!pathOnly.startsWith(SOGS_PROXY_PREFIX)) {
            return next();
          }

          const target = decodeSogsProxyUrl(req.url.split("#")[0]);
          if (!target) {
            res.statusCode = 400;
            res.end("Invalid SOGS proxy path");
            return;
          }

          const params = virtualHostedS3Params(target);
          if (!params) {
            res.statusCode = 502;
            res.end("Proxy target is not a virtual-hosted S3 URL");
            return;
          }

          const client = new S3Client({ region: params.region });
          try {
            if (req.method === "HEAD") {
              const out = await client.send(
                new HeadObjectCommand({ Bucket: params.Bucket, Key: params.Key })
              );
              res.statusCode = 200;
              if (out.ContentType) res.setHeader("Content-Type", out.ContentType);
              if (out.ContentLength != null) res.setHeader("Content-Length", String(out.ContentLength));
              if (out.ETag) res.setHeader("ETag", out.ETag);
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.end();
              return;
            }

            const out = await client.send(
              new GetObjectCommand({ Bucket: params.Bucket, Key: params.Key })
            );
            res.statusCode = 200;
            if (out.ContentType) res.setHeader("Content-Type", out.ContentType);
            if (out.CacheControl) res.setHeader("Cache-Control", out.CacheControl);
            if (out.ETag) res.setHeader("ETag", out.ETag);
            res.setHeader("Access-Control-Allow-Origin", "*");

            const body = out.Body;
            if (body && typeof body.pipe === "function") {
              body.pipe(res);
              return;
            }
            res.statusCode = 500;
            res.end("Empty S3 body");
          } catch (e) {
            const status = e.$metadata?.httpStatusCode ?? 500;
            res.statusCode = status;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(e.message ?? String(e));
          }
        });
      },
    },
  ],
};

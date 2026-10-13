import express, { type Request, type Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 3000;

// tsx runs this file as ESM. The production esbuild bundle is CJS, where
// Node sets __dirname to the dist folder and import.meta is unavailable.
const serverDir = typeof __dirname === "string"
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_SHARE_URL = "https://higgsfield.ai/s/keldUFnImRA";

function allowedShareUrl(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") return DEFAULT_SHARE_URL;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const trusted = host === "higgsfield.ai" || host.endsWith(".higgsfield.ai");
    if (url.protocol === "https:" && trusted) return url.toString();
  } catch {
    // Ignore malformed query values and use the default share page.
  }
  return DEFAULT_SHARE_URL;
}

function decodeUrl(value: string): string {
  return value
    .replace(/\\\//g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/&amp;/g, "&");
}

function extractVideoUrl(html: string): string | null {
  const decoded = html.replace(/&amp;/g, "&");
  const metaTags = decoded.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const property = tag.match(/\bproperty\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
    const name = tag.match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
    const content = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
    const key = property || name;
    if (/^og:video/i.test(key) && content) return decodeUrl(content);
  }

  const direct = decoded.match(/https?:\/\/[^"'\s<>]+?\.mp4(?:\?[^"'\s<>]*)?/i);
  if (direct) return direct[0];

  const escaped = html.match(/https?:\\\/\\\/[^"'\s<>]+?\.mp4(?:\\?[^"'\s<>]*)?/i);
  if (escaped) return decodeUrl(escaped[0]);

  return null;
}

async function createApp() {
  const app = express();

  app.get("/api/higgsfield-video", async (req: Request, res: Response) => {
    const shareUrl = allowedShareUrl(req.query.url);
    try {
      const response = await fetch(shareUrl, {
        headers: {
          "User-Agent": "OYLAVideoProxy/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });

      if (!response.ok) {
        res.status(502).json({ success: false, error: "Share page request failed" });
        return;
      }

      const html = await response.text();
      const url = extractVideoUrl(html);
      if (!url) {
        res.status(404).json({ success: false, error: "No MP4 URL found" });
        return;
      }

      res.json({ success: true, url });
    } catch {
      res.status(502).json({ success: false, error: "Unable to reach share page" });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.basename(serverDir) === "dist" ? serverDir : path.resolve(serverDir, "dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}

createApp().then((app) => {
  app.listen(port, () => {
    console.log(`Velar server listening on http://localhost:${port}`);
  });
});

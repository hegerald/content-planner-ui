// Mini-Server ohne Abhängigkeiten: liefert die GUI aus und leitet /ui-api an Quarkus weiter
// (umgeht CORS, weil Browser und API dann denselben Origin haben).
// Start: node server.js  →  http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const API = new URL(process.env.API || "http://localhost:8080");
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    if (req.url.startsWith("/ui-api")) {
      const headers = { ...req.headers, host: API.host };
      delete headers.origin;
      delete headers.referer;
      const upstream = http.request(
        { hostname: API.hostname, port: API.port, path: req.url, method: req.method, headers },
        (up) => {
          res.writeHead(up.statusCode, up.headers);
          up.pipe(res);
        }
      );
      upstream.on("error", () => {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: 502, code: "BACKEND_UNREACHABLE", message: `Backend unter ${API.origin} nicht erreichbar.` }));
      });
      req.pipe(upstream);
      return;
    }

    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const file = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`Content Planner GUI: http://localhost:${PORT}  (API → ${API.origin})`));

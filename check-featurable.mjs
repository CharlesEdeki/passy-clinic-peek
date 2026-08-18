import { readFileSync } from "node:fs";

let widgetId = process.env.FEATURABLE_WIDGET_ID;
if (!widgetId) {
  try {
    const env = readFileSync(".env", "utf8");
    widgetId = env.match(/^FEATURABLE_WIDGET_ID\s*=\s*(.+)$/m)?.[1]?.trim();
  } catch {}
}
if (!widgetId) {
  console.error("No FEATURABLE_WIDGET_ID in the environment or .env");
  process.exit(1);
}

console.log("Widget ID:", widgetId);
console.log("Node:", process.version, "\n");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

for (const version of ["v1", "v2"]) {
  for (const [label, headers] of [
    ["bare", { accept: "application/json" }],
    ["browser UA", { accept: "application/json", "user-agent": UA }],
  ]) {
    const url = `https://api.featurable.com/${version}/widgets/${widgetId}`;
    try {
      const res = await fetch(url, { headers });
      const body = await res.text();
      const looksJson = body.trimStart().startsWith("{");
      let summary = body.slice(0, 90).replace(/\s+/g, " ");
      if (looksJson) {
        try {
          const d = JSON.parse(body);
          summary = `success=${d.success} reviews=${d.reviews?.length ?? "-"} rating=${d.averageRating ?? "-"}`;
        } catch {}
      }
      console.log(`${version} / ${label.padEnd(10)} -> ${res.status} ${looksJson ? "JSON" : "HTML"} | ${summary}`);
    } catch (err) {
      console.log(`${version} / ${label.padEnd(10)} -> threw: ${err.message}`);
    }
  }
}

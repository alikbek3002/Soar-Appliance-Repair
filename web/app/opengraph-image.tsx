import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Soar Appliance Repair — On-site appliance repair in Streamwood, IL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const emblem = await readFile(join(process.cwd(), "public", "soar-emblem-dark.png"));
  const emblemSrc = `data:image/png;base64,${emblem.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f4f6f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={emblemSrc} width={84} height={90} alt="" />
          <div style={{ fontSize: 40, fontWeight: 700, color: "#1e252b" }}>
            Soar Appliance Repair
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#3a444d",
            }}
          >
            On-Site Appliance Repair · Streamwood, IL
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#1e252b", lineHeight: 1.05 }}>
            Your appliances, repaired right the first time.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#555d63" }}>
          <div>We come to you · Greater Chicago area</div>
          <div style={{ fontWeight: 700, color: "#1e252b" }}>(224) 442-2422</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

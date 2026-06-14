import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Gear-inspired mark: dark hub with concentric rings, matching the site logo.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4f6f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: "#3a444d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#f4f6f7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a444d" }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

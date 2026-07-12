import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — Platform / DevOps Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A0E12",
          color: "#E7ECF1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#34D399", letterSpacing: 2 }}>PLATFORM / DEVOPS ENGINEER</div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, marginTop: 24 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 28, color: "#8B97A3", marginTop: 32, maxWidth: 900 }}>
          Building reliable, scalable platforms with automation and cloud-native
          architecture.
        </div>
      </div>
    ),
    { ...size },
  );
}

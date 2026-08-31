import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0e0a",
          border: "2px solid #33ff66",
          borderRadius: 6,
          fontFamily: "monospace",
          fontWeight: 700,
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: 26,
            color: "#1f9943",
            transform: "translateX(-4px)",
          }}
        >
          C
        </div>
        <div
          style={{
            position: "absolute",
            display: "flex",
            fontSize: 18,
            color: "#33ff66",
            transform: "translateX(4px)",
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "better-registry — The shadcn for AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const geistBlackPromise = readFile(
  join(process.cwd(), "src/assets/fonts/Geist-Black.ttf"),
);
const geistSemiBoldPromise = readFile(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf"),
);
const geistMonoBoldPromise = readFile(
  join(process.cwd(), "src/assets/fonts/GeistMono-Bold.ttf"),
);

export default async function Image() {
  const [geistBlack, geistSemiBold, geistMonoBold] = await Promise.all([
    geistBlackPromise,
    geistSemiBoldPromise,
    geistMonoBoldPromise,
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#000000",
        fontFamily: "Geist",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dotted grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Accent bar at top */}
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#BFFF00",
          display: "flex",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
          padding: "48px 64px 40px 64px",
        }}
      >
        {/* Top section: Logo + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: "#BFFF00",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "28px",
                fontWeight: 600,
                color: "#ffffff",
                fontFamily: "Geist",
              }}
            >
              better <span style={{ fontWeight: 900 }}>registry</span>
            </span>
          </div>

          {/* Open source badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "3px solid #BFFF00",
              padding: "8px 16px",
              fontFamily: "GeistMono",
              fontSize: "14px",
              fontWeight: 700,
              color: "#BFFF00",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}
          >
            OPEN SOURCE
          </div>
        </div>

        {/* Center: Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "84px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontFamily: "Geist",
            }}
          >
            The shadcn
          </div>
          <div
            style={{
              fontSize: "84px",
              fontWeight: 900,
              color: "#BFFF00",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontFamily: "Geist",
            }}
          >
            for AI.
          </div>
        </div>

        {/* Bottom: Description + install command */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          {/* Description */}
          <div
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.5,
              maxWidth: "480px",
              fontFamily: "Geist",
            }}
          >
            SDK-agnostic AI tools and agents. Install with one command. Own the
            source code.
          </div>

          {/* Terminal command */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "3px solid rgba(255,255,255,0.15)",
              padding: "12px 20px",
              fontFamily: "GeistMono",
              fontSize: "16px",
              fontWeight: 700,
              color: "#BFFF00",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)" }}>$</span>
            <span>npx better-registry add exa-search</span>
          </div>
        </div>
      </div>

      {/* Accent bar at bottom */}
      <div
        style={{
          width: "100%",
          height: "4px",
          backgroundColor: "#BFFF00",
          display: "flex",
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistBlack,
          weight: 900,
          style: "normal" as const,
        },
        {
          name: "Geist",
          data: geistSemiBold,
          weight: 600,
          style: "normal" as const,
        },
        {
          name: "GeistMono",
          data: geistMonoBold,
          weight: 700,
          style: "normal" as const,
        },
      ],
    },
  );
}

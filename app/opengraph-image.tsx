import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Build the absolute URL dynamically
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://your-production-domain.com"; // Fallback for local build

  const logoUrl = `${baseUrl}/logo.png`; // Assumes logo.png is in /public

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        color: "white",
        padding: 80,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Use the absolute HTTPS URL */}
        <img src={logoUrl} width={120} height={120} alt="Logo" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0 }}>
            {BRAND.name}
          </h1>
          <p style={{ fontSize: 32, color: "#cbd5e1", marginTop: 16 }}>
            {BRAND.tagline}
          </p>
        </div>
      </div>
    </div>,
    size,
  );
}

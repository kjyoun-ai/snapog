import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { validateApiKey, recordUsage } from "@/lib/db";

export const runtime = "nodejs";

type Theme = "default" | "dark" | "gradient" | "minimal" | "bold";

interface TemplateProps {
  title: string;
  description: string;
  logo: string;
}

function DefaultTemplate({ title, description, logo }: TemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        color: "#111827",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#7c3aed" }}>
          {logo}
        </div>
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 24, color: "#6b7280", lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
}

function DarkTemplate({ title, description, logo }: TemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        color: "#ededed",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#a78bfa" }}>
          {logo}
        </div>
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 24, color: "#9ca3af", lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
}

function GradientTemplate({ title, description, logo }: TemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {logo}
        </div>
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.8)",
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>
    </div>
  );
}

function MinimalTemplate({ title, description, logo }: TemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "60px 80px",
        width: "100%",
        height: "100%",
        backgroundColor: "#fafafa",
        color: "#111827",
      }}
    >
      <div style={{ display: "flex", marginBottom: 32 }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: "#6b7280" }}>
          {logo}
        </div>
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 600,
          lineHeight: 1.2,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 22, color: "#9ca3af", lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
}

function BoldTemplate({ title, description, logo }: TemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "60px 80px",
        width: "100%",
        height: "100%",
        backgroundColor: "#1e1b4b",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 60,
          left: 80,
          fontSize: 24,
          fontWeight: 700,
          color: "#c4b5fd",
        }}
      >
        {logo}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 16,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 24, color: "#a5b4fc", lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
}

const TEMPLATES: Record<Theme, React.FC<TemplateProps>> = {
  default: DefaultTemplate,
  dark: DarkTemplate,
  gradient: GradientTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const title = searchParams.get("title") || "Hello World";
  const description =
    searchParams.get("description") || "Generated with SnapOG";
  const theme = (searchParams.get("theme") || "default") as Theme;
  const logo = searchParams.get("logo") || "SnapOG";

  // API key auth — optional for demo, required for production usage
  const apiKey = searchParams.get("key") || request.headers.get("x-api-key");

  if (apiKey) {
    const auth = validateApiKey(apiKey);
    if (!auth.valid) {
      return new Response(
        JSON.stringify({ error: auth.remaining === 0 ? "Monthly limit exceeded" : "Invalid API key" }),
        { status: auth.remaining === 0 ? 429 : 401, headers: { "Content-Type": "application/json" } }
      );
    }
    recordUsage(auth.keyId!);
  }

  const Template = TEMPLATES[theme] || TEMPLATES.default;

  return new ImageResponse(
    <Template title={title} description={description} logo={logo} />,
    { width: 1200, height: 630 }
  );
}

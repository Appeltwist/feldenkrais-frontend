import { NextResponse } from "next/server";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api").replace(/\/+$/, "");

function normalizeHostname(hostname: string) {
  const cleaned = hostname.trim().toLowerCase().replace(/^https?:\/\//, "");
  const firstPart = cleaned.split("/")[0] ?? cleaned;
  const firstHost = firstPart.split(",")[0]?.trim() ?? firstPart;
  return firstHost.replace(/:\d+$/, "");
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const hostname = normalizeHostname(url.searchParams.get("hostname") ?? "");
  const locale = (url.searchParams.get("locale") ?? "").trim();
  const center = (url.searchParams.get("center") ?? "").trim();

  if (!hostname) {
    return NextResponse.json({ detail: "Missing required query param: hostname." }, { status: 400 });
  }

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON payload." }, { status: 400 });
  }

  const backendUrl = new URL(`${API_BASE}/leads`);
  backendUrl.searchParams.set("domain", hostname);
  if (locale) {
    backendUrl.searchParams.set("locale", locale);
  }
  if (center) {
    backendUrl.searchParams.set("center", center);
  }

  const backendResponse = await fetch(backendUrl.toString(), {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const contentType = backendResponse.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await backendResponse.json();
    return NextResponse.json(body, { status: backendResponse.status });
  }

  const textBody = await backendResponse.text();
  return NextResponse.json({ detail: textBody || "Lead capture request failed." }, { status: backendResponse.status });
}

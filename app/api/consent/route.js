import { NextResponse } from "next/server";
import { consumeRateLimit } from "../../../lib/rateLimit";

// Journal des consentements : enregistre le choix du visiteur (preuve, à conserver). Aucune adresse IP n'est
// enregistrée ; elle sert seulement à limiter le nombre d'envois par minute, en mémoire.
export const dynamic = "force-dynamic";

const VISITOR_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VERSION = /^[0-9A-Za-z._-]{1,32}$/;

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request) {
  const limiter = consumeRateLimit(`consent:${getClientIp(request)}`, { limit: 20, windowMs: 60 * 1000 });
  if (!limiter.allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = typeof body?.visitorId === "string" ? body.visitorId : "";
  const choice = body?.choice === "granted" || body?.choice === "denied" ? body.choice : "";
  const version = typeof body?.version === "string" ? body.version : "";
  const lang = body?.lang === "en" ? "en" : "fr";

  if (!VISITOR_ID.test(visitorId) || !choice || !VERSION.test(version)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Hors configuration (développement sans base) : le choix reste valable dans le navigateur.
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const response = await fetch(new URL("/rest/v1/consent_logs", url), {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ visitor_id: visitorId, choice, text_version: version, lang }),
    });

    if (!response.ok) {
      console.error("Consent log failed", response.status, await response.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error("Consent log failed", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored: true });
}

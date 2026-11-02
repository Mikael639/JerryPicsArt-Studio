import { NextResponse } from "next/server";

// Réveil quotidien de la base : Supabase met en pause un projet gratuit après 7 jours sans activité, et les pages du site
// sont en grande partie mises en mémoire, donc les visites seules ne suffisent pas. Vercel appelle cette adresse une fois
// par jour (voir vercel.json) ; on lit une ligne, sans rien enregistrer ni renvoyer.
export const dynamic = "force-dynamic";

export async function GET(request) {
  // Si CRON_SECRET est défini sur Vercel, seul Vercel (qui l'envoie) peut déclencher la lecture.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ ok: false, reason: "supabase non configuré" }, { status: 500 });
  }

  try {
    const url = new URL("/rest/v1/site_settings", supabaseUrl);
    url.searchParams.set("select", "key");
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    });

    return NextResponse.json({ ok: response.ok }, { status: response.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

import { createHash } from "node:crypto";

// Limite d'essais sur la connexion admin : 5 échecs en 15 minutes par adresse IP, puis blocage jusqu'à la fin de la
// fenêtre. Le compteur vit dans la base (réglage « admin_login_throttle » de site_settings) car chaque requête peut
// tomber sur un serveur différent, avec sa propre mémoire. L'adresse IP n'est jamais gardée en clair (empreinte salée).
// Si la base ne répond pas, on retombe sur un compteur en mémoire : moins fiable, mais jamais ouvert.
const KEY = "admin_login_throttle";
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

const memory = new Map();

function getConfig() {
  return { url: process.env.SUPABASE_URL || "", key: process.env.SUPABASE_SERVICE_ROLE_KEY || "" };
}

function fingerprint(ip) {
  return createHash("sha256")
    .update(`${process.env.ADMIN_SESSION_SECRET || ""}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

function headers(key) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

// Lecture sans cache (un compteur périmé laisserait passer des essais).
async function readState() {
  const { url, key } = getConfig();
  if (!url || !key) return null;

  const endpoint = new URL("/rest/v1/site_settings", url);
  endpoint.searchParams.set("select", "value");
  endpoint.searchParams.set("key", `eq.${KEY}`);
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint.toString(), { headers: headers(key), cache: "no-store" });
  if (!response.ok) throw new Error(`Lecture impossible (${response.status})`);
  const rows = await response.json();
  const value = rows?.[0]?.value;
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

async function writeState(state) {
  const { url, key } = getConfig();
  if (!url || !key) throw new Error("Base non configurée.");

  const response = await fetch(new URL("/rest/v1/site_settings", url).toString(), {
    method: "POST",
    headers: { ...headers(key), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({ key: KEY, value: state, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Écriture impossible (${response.status})`);
}

function prune(state, now) {
  return Object.fromEntries(Object.entries(state).filter(([, entry]) => entry?.resetAt > now));
}

async function loadState(now) {
  try {
    const stored = await readState();
    if (stored) return prune({ ...Object.fromEntries(memory), ...stored }, now);
  } catch {
    // base indisponible : compteur en mémoire seul
  }
  return prune(Object.fromEntries(memory), now);
}

async function saveState(state) {
  for (const [id, entry] of Object.entries(state)) memory.set(id, entry);
  try {
    await writeState(state);
  } catch {
    // le compteur en mémoire garde l'essai
  }
}

// { blocked, retryAfterMinutes } : à appeler avant de vérifier le mot de passe.
export async function getLoginBlock(ip, now = Date.now()) {
  const entry = (await loadState(now))[fingerprint(ip)];
  if (entry && entry.count >= MAX_FAILURES) {
    return { blocked: true, retryAfterMinutes: Math.max(1, Math.ceil((entry.resetAt - now) / 60000)) };
  }
  return { blocked: false, retryAfterMinutes: 0 };
}

export async function recordLoginFailure(ip, now = Date.now()) {
  const state = await loadState(now);
  const id = fingerprint(ip);
  const entry = state[id];
  state[id] = entry ? { ...entry, count: entry.count + 1 } : { count: 1, resetAt: now + WINDOW_MS };
  await saveState(state);
}

export async function clearLoginFailures(ip, now = Date.now()) {
  const id = fingerprint(ip);
  memory.delete(id);
  const state = await loadState(now);
  if (!state[id]) return;
  delete state[id];
  try {
    await writeState(state);
  } catch {
    // sans importance : la fenêtre expire d'elle-même
  }
}

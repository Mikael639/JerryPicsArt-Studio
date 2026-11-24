-- Journal des choix de consentement (mesure d'audience).
-- Conserve la preuve du choix : le choix, la date, la version du texte affiché, la langue et un identifiant
-- aléatoire propre au navigateur. Ni nom, ni e-mail, ni adresse IP.
-- Accès réservé au serveur (clé service) : la sécurité par ligne est activée et aucune règle publique n'est créée.

create table if not exists public.consent_logs (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  choice text not null check (choice in ('granted', 'denied')),
  text_version text not null,
  lang text not null default 'fr',
  created_at timestamptz not null default now()
);

create index if not exists consent_logs_visitor_idx on public.consent_logs (visitor_id, created_at desc);

alter table public.consent_logs enable row level security;

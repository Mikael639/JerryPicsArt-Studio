-- Journal des invitations d'avis clients (Trustpilot).
-- L'adresse e-mail du client n'est jamais stockée en clair : seule son empreinte HMAC-SHA256 (email_hash)
-- est enregistrée pour empêcher tout doublon sur 30 jours et limiter la cadence à 20 envois par heure.
-- Accès réservé au serveur (clé service) : la sécurité par ligne (RLS) est activée sans aucune règle publique.

create table if not exists public.review_invitations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email_hash text not null,
  client_name text not null,
  reference text,
  lang text not null default 'fr' check (lang in ('fr', 'en')),
  status text not null check (status in ('sent', 'failed')),
  error_message text
);

create index if not exists review_invitations_created_at_idx
  on public.review_invitations (created_at desc);

create index if not exists review_invitations_email_hash_idx
  on public.review_invitations (email_hash, created_at desc);

alter table public.review_invitations enable row level security;

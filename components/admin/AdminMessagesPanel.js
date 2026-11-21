import { useMemo, useState } from "react";
import AdminSelect from "./AdminSelect";

const PAGE_SIZE = 20;

const statusLabels = {
  new: "À traiter",
  soon: "Répondre vite",
  replied: "Répondu",
  archived: "Archivé",
};

const statusFilters = [
  { value: "all", label: "Tous" },
  { value: "new", label: "À traiter" },
  { value: "soon", label: "Répondre vite" },
  { value: "replied", label: "Répondu" },
  { value: "archived", label: "Archivé" },
];

// Pastille de statut affichée sur la ligne repliée : on voit d'un coup d'œil ce qu'il reste à traiter.
const statusDotStyles = {
  new: "bg-amber-500",
  soon: "bg-rose-500",
  replied: "bg-emerald-500",
  archived: "bg-stone-300",
};

const qualificationStyles = {
  PRIORITAIRE: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "À QUALIFIER": "bg-amber-50 text-amber-800 border-amber-200",
  "HORS BUDGET": "bg-stone-100 text-stone-600 border-stone-200",
};

function extractQualification(project = "") {
  const match = String(project).match(/^Statut\s*:\s*\[([^\]]+)\]/m);
  return match ? match[1].trim() : "";
}

function formatDate(value) {
  if (!value) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

// Date courte de réception (ligne repliée) : « 20 nov. 2026 ».
function formatShortDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

// Date de l'événement (2027-06-12 devient « 12 juin 2027 ») ; toute autre valeur est reprise telle quelle.
function formatEventDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ""));
  if (!match) return String(value || "");
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 text-ink/45 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function AdminMessagesPanel({ messages, onUpdateStatus, onDeleteMessage }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openIds, setOpenIds] = useState(() => new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const statusCounts = useMemo(() => {
    const counts = { all: messages.length, new: 0, soon: 0, replied: 0, archived: 0 };
    for (const message of messages) {
      const status = message.status || "new";
      counts[status] = (counts[status] || 0) + 1;
    }
    return counts;
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return messages.filter((message) => {
      const status = message.status || "new";
      const matchesStatus = statusFilter === "all" ? true : status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      const haystack = [
        message.name,
        message.email,
        message.phone,
        message.company,
        message.location,
        message.serviceType,
        message.project,
        message.referenceLink,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [messages, searchQuery, statusFilter]);

  const visibleMessages = filteredMessages.slice(0, visibleCount);
  const allVisibleOpen = visibleMessages.length > 0 && visibleMessages.every((message) => openIds.has(message.id));

  function toggleOne(id) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setOpenIds(allVisibleOpen ? new Set() : new Set(visibleMessages.map((message) => message.id)));
  }

  // Un changement de recherche ou de filtre repart du premier paquet de 20.
  function changeSearch(value) {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  function changeFilter(value) {
    setStatusFilter(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-line/20 bg-white/65 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl">Demandes de devis</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
              Suivez les demandes reçues depuis le formulaire de contact et marquez leur avancement.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-amber-50 px-3 py-1 font-bold uppercase tracking-[0.16em] text-amber-800">
              À traiter : {statusCounts.new || 0}
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-1 font-bold uppercase tracking-[0.16em] text-rose-800">
              Urgents : {statusCounts.soon || 0}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold uppercase tracking-[0.16em] text-emerald-800">
              Répondus : {statusCounts.replied || 0}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="flex items-center gap-3 rounded-full border border-line/25 bg-paper/70 px-4 py-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Rechercher par nom, e-mail, lieu, contenu..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => changeSearch("")}
                className="text-xs text-ink/45 hover:text-ink"
                aria-label="Effacer la recherche"
              >
                Effacer
              </button>
            ) : null}
          </label>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const isActive = filter.value === statusFilter;
              const count = statusCounts[filter.value] || 0;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => changeFilter(filter.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                    isActive
                      ? "border-ink bg-ink text-paper"
                      : "border-line/25 bg-paper/70 text-ink/60 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {filter.label}
                  <span className={`ml-1.5 ${isActive ? "text-paper/70" : "text-ink/40"}`}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-line/20 bg-white/55 p-8 text-center text-sm text-ink/60">
          Aucun message pour le moment.
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-line/20 bg-white/55 p-8 text-center text-sm text-ink/60">
          Aucun message ne correspond aux filtres.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-ink/55">
            <p>
              {visibleMessages.length === filteredMessages.length
                ? `${filteredMessages.length} demande${filteredMessages.length > 1 ? "s" : ""}`
                : `${visibleMessages.length} sur ${filteredMessages.length} demandes`}
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="font-bold uppercase tracking-[0.16em] text-ink/65 underline decoration-ink/25 underline-offset-4 transition hover:text-ink"
            >
              {allVisibleOpen ? "Tout replier" : "Tout déplier"}
            </button>
          </div>

          <div className="grid gap-2">
            {visibleMessages.map((message) => {
              const status = message.status || "new";
              const qualification = extractQualification(message.project);
              const badgeStyle = qualificationStyles[qualification] || "bg-paper text-ink/70 border-line/20";
              const isOpen = openIds.has(message.id);
              const panelId = `demande-${message.id}`;
              const summary = [message.serviceType, formatEventDate(message.eventDate), message.location]
                .filter(Boolean)
                .join(" · ");

              return (
                <article key={message.id} className="overflow-hidden rounded-2xl border border-line/20 bg-white/70">
                  <button
                    type="button"
                    onClick={() => toggleOne(message.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-paper/60 sm:gap-4 sm:px-5"
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDotStyles[status] || statusDotStyles.new}`}
                      title={statusLabels[status] || statusLabels.new}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={`truncate font-serif text-lg leading-tight sm:text-xl ${status === "new" ? "font-semibold" : ""}`}>
                          {message.name || "Sans nom"}
                        </span>
                        {qualification ? (
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${badgeStyle}`}>
                            {qualification}
                          </span>
                        ) : null}
                        <span className="sr-only">{statusLabels[status] || statusLabels.new}</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink/55 sm:text-[13px]">
                        {summary || "Prestation non précisée"}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.18em] text-ink/45 sm:block">
                      {formatShortDate(message.createdAt)}
                    </span>
                    <Chevron open={isOpen} />
                  </button>

                  {isOpen ? (
                    <div id={panelId} className="border-t border-line/10 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-ink/45">{formatDate(message.createdAt)}</p>
                          <p className="mt-1 text-sm text-ink/65">
                            {message.email}
                            {message.phone ? ` | ${message.phone}` : ""}
                          </p>
                        </div>
                        <AdminSelect
                          compact
                          className="w-full sm:w-52"
                          value={status}
                          onChange={(next) => onUpdateStatus(message.id, next)}
                          options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                        />
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-ink/70 md:grid-cols-4">
                        <p>
                          <span className="font-semibold text-ink">Prestation :</span> {message.serviceType || "Non précisée"}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">Lieu :</span> {message.location || "Non précisé"}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">Date :</span> {message.eventDate || "Non précisée"}
                        </p>
                        <p>
                          <span className="font-semibold text-ink">Budget :</span> {message.budget || "Non précisé"}
                        </p>
                      </div>

                      <p className="mt-4 whitespace-pre-wrap rounded-xl bg-paper/70 p-4 text-sm leading-relaxed text-ink/75">
                        {message.project}
                      </p>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line/10 pt-4">
                        <div className="flex flex-wrap gap-2">
                          {message.email ? (
                            <a
                              href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.serviceType || "votre demande"} - JerryPicsArt`)}`}
                              className="inline-flex items-center gap-2 rounded-full border border-line/25 px-4 py-2 text-xs font-medium transition hover:border-ink hover:bg-paper"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-10 5L2 7" />
                              </svg>
                              Répondre par e-mail
                            </a>
                          ) : null}
                          {message.phone ? (
                            <a
                              href={`tel:${message.phone.replace(/\s+/g, "")}`}
                              className="inline-flex items-center gap-2 rounded-full border border-line/25 px-4 py-2 text-xs font-medium transition hover:border-ink hover:bg-paper"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z" />
                              </svg>
                              Appeler
                            </a>
                          ) : null}
                          {message.referenceLink ? (
                            <a
                              href={message.referenceLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block rounded-full border border-line/25 px-4 py-2 text-xs font-medium transition hover:border-ink hover:bg-paper"
                            >
                              Ouvrir la référence
                            </a>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Supprimer ce message définitivement ?")) {
                              onDeleteMessage(message.id);
                            }
                          }}
                          className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 transition hover:bg-red-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          {visibleMessages.length < filteredMessages.length ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-full border border-line/25 bg-paper/70 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink/70 transition hover:border-ink hover:text-ink"
              >
                Afficher {Math.min(PAGE_SIZE, filteredMessages.length - visibleMessages.length)} de plus
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

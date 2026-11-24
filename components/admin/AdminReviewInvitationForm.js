"use client";

import { useState } from "react";
import { sendReviewInvitationAction } from "../../app/admin/photos/actions";

const INITIAL_FORM = {
  name: "",
  email: "",
  reference: "",
  lang: "fr",
};

function inputClass() {
  return "w-full rounded-xl border border-line/25 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent disabled:opacity-60";
}

export default function AdminReviewInvitationForm({ onStatus, onError }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSending, setIsSending] = useState(false);
  const [localSuccess, setLocalSuccess] = useState("");
  const [localError, setLocalError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSending) return;

    setLocalSuccess("");
    setLocalError("");
    if (onStatus) onStatus("");
    if (onError) onError("");

    const trimmedName = form.name.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
    const normalizedEmail = form.email.trim().toLowerCase();
    const trimmedReference = form.reference.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      const msg = "Le nom du client est obligatoire (entre 2 et 80 caractères, sans HTML).";
      setLocalError(msg);
      if (onError) onError(msg);
      return;
    }

    if (!normalizedEmail || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(normalizedEmail)) {
      const msg = "Veuillez saisir une adresse e-mail client valide.";
      setLocalError(msg);
      if (onError) onError(msg);
      return;
    }

    setIsSending(true);
    try {
      const result = await sendReviewInvitationAction({
        name: trimmedName,
        email: normalizedEmail,
        reference: trimmedReference,
        lang: form.lang === "en" ? "en" : "fr",
      });

      if (!result?.ok) {
        const errMsg = result?.message || "Impossible d'envoyer l'invitation.";
        setLocalError(errMsg);
        if (onError) onError(errMsg);
        return;
      }

      const okMsg = result.message || "Invitation envoyée avec succès.";
      setLocalSuccess(okMsg);
      if (onStatus) onStatus(okMsg);
      // En cas de succès uniquement, on vide les champs de saisie (la langue choisie est conservée).
      setForm((current) => ({ ...INITIAL_FORM, lang: current.lang }));
    } catch (error) {
      const errMsg = error?.message || "Une erreur inattendue est survenue lors de l'envoi.";
      setLocalError(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      aria-labelledby="trustpilot-invite-title"
      className="space-y-6 rounded-2xl border border-line/20 bg-white/65 p-5 md:p-6"
    >
      <div className="border-b border-line/10 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-ink/45">Trustpilot</p>
        <h2 id="trustpilot-invite-title" className="mt-1 font-serif text-3xl">
          Inviter un client à laisser un avis
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Envoie au client un court e-mail de remerciement (« Merci pour votre confiance ») avec votre adresse
          Trustpilot en copie cachée côté serveur. Trustpilot détecte ce message et envoie automatiquement
          l&apos;invitation d&apos;avis.
        </p>
      </div>

      {/* Règles d'utilisation Trustpilot (visibles en permanence) */}
      <div className="rounded-xl border border-amber-900/15 bg-paper/80 p-4 text-xs leading-relaxed text-ink/75">
        <p className="font-bold uppercase tracking-[0.16em] text-ink/80">
          Règles Trustpilot à respecter
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Inviter uniquement des clients ayant réellement bénéficié d&apos;une prestation photographique.</li>
          <li>Ne jamais trier ni sélectionner les clients selon leur satisfaction attendue (inviter tout le monde équitablement).</li>
          <li>Ne proposer aucune contrepartie (remise, cadeau, photo supplémentaire) en échange d&apos;un avis.</li>
        </ul>
      </div>

      {localError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50/90 px-4 py-3 text-sm text-red-900"
        >
          {localError}
        </div>
      ) : null}

      {localSuccess ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900"
        >
          {localSuccess}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              Nom du client <span className="text-accent">*</span>
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={80}
              disabled={isSending}
              placeholder="Ex. Claire & Thomas"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClass()}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              E-mail du client <span className="text-accent">*</span>
            </span>
            <input
              type="email"
              required
              maxLength={254}
              disabled={isSending}
              placeholder="client@exemple.fr"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              onBlur={(event) => updateField("email", event.target.value.trim().toLowerCase())}
              className={inputClass()}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              Référence <span className="font-normal lowercase tracking-normal text-ink/45">(facultatif, usage interne)</span>
            </span>
            <input
              type="text"
              maxLength={120}
              disabled={isSending}
              placeholder="Ex. Séance mariage 12/11"
              value={form.reference}
              onChange={(event) => updateField("reference", event.target.value)}
              className={inputClass()}
            />
          </label>

          <div className="space-y-1.5">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              Langue de l&apos;e-mail client
            </span>
            <div className="flex gap-2">
              {[
                { value: "fr", label: "Français (FR)" },
                { value: "en", label: "Anglais (EN)" },
              ].map((option) => {
                const active = form.lang === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isSending}
                    onClick={() => updateField("lang", option.value)}
                    aria-pressed={active}
                    className={`flex-1 rounded-xl border px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-line/25 bg-paper text-ink/70 hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/10 pt-4">
          <p className="text-xs text-ink/50">
            Protection active : 1 seule invitation par adresse sur 30 jours · Maximum 20 envois par heure.
          </p>
          <button
            type="submit"
            disabled={isSending}
            className="rounded-full bg-ink px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] text-paper transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Envoi en cours..." : "Envoyer l'invitation"}
          </button>
        </div>
      </form>
    </section>
  );
}

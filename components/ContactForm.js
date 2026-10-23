"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { submitContactForm } from "../app/contact/actions";
import { initialContactFormState } from "../app/contact/constants";
import {
  audienceOptions,
  budgetOptions,
  guestOptions,
  serviceOptions,
  sourceOptions,
} from "../lib/contactValidation";
import { trackEvent } from "../lib/analytics";
import SubmitButton from "./SubmitButton";
import CustomSelect from "./CustomSelect";

const PLACEHOLDER = "Choisir…";

// Pré-remplissage selon le paramètre ?type= de l'URL.
const PRESETS = {
  mariage: { audience: "Particulier (mariage)", serviceType: "Mariage" },
  evenement: { audience: "Agence événementielle", serviceType: "Événement" },
  entreprise: { audience: "Entreprise", serviceType: "Événement d'entreprise" },
};

const inputClass =
  "w-full rounded-xl border border-line/18 bg-paper/88 px-4 py-3 outline-none transition focus:border-accent focus:bg-white";

function SuccessCard({ message, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-inset border border-emerald-200/60 bg-[linear-gradient(180deg,rgba(236,253,245,0.95),rgba(255,255,255,0.92))] p-8 text-center shadow-[0_24px_80px_rgba(12,10,8,0.08)]"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)]"
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </motion.div>
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-700/80">Demande envoyée</p>
      <p className="mx-auto mt-4 max-w-xl font-serif text-2xl leading-snug tracking-tight text-ink md:text-3xl">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-line/25 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-white"
        >
          Envoyer une autre demande
        </button>
        <Link
          href="/signature"
          className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/60 underline-offset-4 transition hover:text-ink hover:underline"
        >
          Voir les séries Fashion Week
        </Link>
      </div>
    </motion.div>
  );
}

function FieldError({ message }) {
  return message ? <span className="text-xs text-red-700">{message}</span> : null;
}

export default function ContactForm({ type = "" }) {
  const formRef = useRef(null);
  const [formState, formAction] = useActionState(submitContactForm, initialContactFormState);
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);
  const [lastStatus, setLastStatus] = useState("idle");
  const errors = formState.errors || {};
  const status = formState.status || "idle";
  const message = formState.message || "";
  const showSuccessCard = status === "success" && !isSuccessDismissed;
  const preset = PRESETS[type] || {};

  // Modèle React 19 : dériver l'état pendant le rendu.
  if (status !== lastStatus) {
    setLastStatus(status);
    if (status === "success") {
      setIsSuccessDismissed(false);
      trackEvent("formulaire_envoye", { qualification: formState.qualification || "inconnue" });
    }
  }

  useEffect(() => {
    if (status === "success") {
      formRef.current?.reset();
    }
  }, [status]);

  if (showSuccessCard) {
    return (
      <AnimatePresence mode="wait">
        <SuccessCard key="success" message={message} onReset={() => setIsSuccessDismissed(true)} />
      </AnimatePresence>
    );
  }

  return (
    <form
      ref={formRef}
      id="contact-form"
      action={formAction}
      className="grid scroll-mt-32 gap-5 rounded-inset border border-line/12 bg-white/52 p-6 md:grid-cols-2 md:p-7"
    >
      <div className="space-y-3 rounded-inset border border-line/10 bg-paper/70 p-5 md:col-span-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-ink/48">Demande de devis</p>
        <h2 className="font-serif text-3xl leading-tight md:text-4xl">Parlez-moi du contexte et du rendu attendu.</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-ink/65 md:text-base">
          Date, lieu, type de prestation et ambiance recherchée suffisent pour lancer un échange clair.
        </p>
      </div>

      <div className="md:col-span-2">
        <CustomSelect
          name="audience"
          label="Vous êtes"
          options={[PLACEHOLDER, ...audienceOptions]}
          defaultValue={preset.audience || PLACEHOLDER}
          error={errors.audience}
        />
        <FieldError message={errors.audience} />
      </div>

      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">Nom et prénom</span>
        <input name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} className={inputClass} required />
        <FieldError message={errors.name} />
      </label>

      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">E-mail</span>
        <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={inputClass} required />
        <FieldError message={errors.email} />
      </label>

      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">Téléphone</span>
        <input
          name="phone"
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={Boolean(errors.phone)}
          className={inputClass}
          placeholder="Facultatif"
        />
        <FieldError message={errors.phone} />
      </label>

      <div>
        <CustomSelect
          name="serviceType"
          label="Type de prestation"
          options={[PLACEHOLDER, ...serviceOptions]}
          defaultValue={preset.serviceType || PLACEHOLDER}
          error={errors.serviceType}
        />
        <FieldError message={errors.serviceType} />
      </div>

      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">Date de l&apos;événement</span>
        <input name="eventDate" type="date" aria-invalid={Boolean(errors.eventDate)} className={inputClass} required />
        <FieldError message={errors.eventDate} />
      </label>

      <label className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">Lieu</span>
        <input
          name="location"
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.location)}
          className={inputClass}
          placeholder="Ville, salle, lieu…"
          required
        />
        <FieldError message={errors.location} />
      </label>

      <div>
        <CustomSelect
          name="guests"
          label="Nombre d'invités"
          options={[PLACEHOLDER, ...guestOptions]}
          defaultValue={PLACEHOLDER}
          error={errors.guests}
        />
        <FieldError message={errors.guests} />
      </div>

      <div>
        <CustomSelect
          name="budget"
          label="Budget indicatif"
          options={[PLACEHOLDER, ...budgetOptions]}
          defaultValue={PLACEHOLDER}
          error={errors.budget}
        />
        <FieldError message={errors.budget} />
      </div>

      <div>
        <CustomSelect
          name="source"
          label="Comment m'avez-vous connu ?"
          options={[PLACEHOLDER, ...sourceOptions]}
          defaultValue={PLACEHOLDER}
          error={errors.source}
        />
        <FieldError message={errors.source} />
      </div>

      <label className="space-y-2 md:col-span-2">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">Message</span>
        <textarea
          name="project"
          rows={6}
          aria-invalid={Boolean(errors.project)}
          className="w-full rounded-[1.2rem] border border-line/18 bg-paper/88 px-4 py-3 outline-none transition focus:border-accent focus:bg-white"
          placeholder="Type de projet, ambiance recherchée, contraintes utiles…"
          required
        />
        <FieldError message={errors.project} />
      </label>

      <div className="space-y-2 md:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(errors.consent)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
          />
          <span>
            J&apos;accepte que mes données soient utilisées pour répondre à ma demande.{" "}
            <Link href="/confidentialite" className="underline underline-offset-4 hover:text-ink">
              Politique de confidentialité
            </Link>
          </span>
        </label>
        <FieldError message={errors.consent} />
      </div>

      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <SubmitButton
          idleLabel="Envoyer la demande"
          pendingLabel="Envoi…"
          className="w-fit rounded-full bg-ink px-6 py-3 text-sm uppercase tracking-[0.18em] text-paper transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
        />

        <p className="text-sm text-ink/55">Réponse sous 24 à 48 h.</p>

        {message && status !== "success" ? (
          <p aria-live="polite" className="text-sm text-red-700">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

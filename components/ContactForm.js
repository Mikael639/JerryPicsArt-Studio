"use client";

import { Fragment, startTransition, useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { submitContactForm } from "../app/contact/actions";
import { initialContactFormState } from "../app/contact/constants";
import { budgetOptions, getQuoteType, quoteTypeList, sourceOptions } from "../lib/quoteTypes";
import { trackEvent } from "../lib/analytics";
import { CONTACT_FORM_COPY } from "../lib/i18n";
import { earliestEventDate } from "../lib/contactValidation";
import { useLanguage } from "./LanguageProvider";
import SubmitButton from "./SubmitButton";
import CustomSelect from "./CustomSelect";

const inputClass =
  "w-full rounded-xl border border-line/18 bg-paper/88 px-4 py-3 outline-none transition focus:border-accent focus:bg-white";

// Amène un élément au milieu de l'écran (sans animation si le visiteur l'a demandé dans ses réglages).
function centerInView(element) {
  if (!element) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
}

// Si l'appel au serveur échoue (coupure réseau, page restée ouverte pendant une mise à jour du site),
// on affiche un message et la saisie reste en place, au lieu de faire planter la page.
async function sendSafely(previousState, formData) {
  try {
    return await submitContactForm(previousState, formData);
  } catch (error) {
    console.error("Contact form request failed", error);
    const copy = CONTACT_FORM_COPY[formData.get("lang")] || CONTACT_FORM_COPY.fr;
    return { status: "error", message: copy.networkError, errors: {} };
  }
}

function SuccessCard({ message, onReset, copy }) {
  const cardRef = useRef(null);

  // Le formulaire (long) est remplacé par ce message (court) : sans cela, le visiteur reste en bas de page, loin du message.
  useEffect(() => {
    const frame = requestAnimationFrame(() => centerInView(cardRef.current));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      ref={cardRef}
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
      <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-700/80">{copy.successBadge}</p>
      <p className="mx-auto mt-4 max-w-xl font-serif text-2xl leading-snug tracking-tight text-ink md:text-3xl">{message}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-line/25 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-white"
        >
          {copy.sendAnother}
        </button>
        <Link
          href="/signature"
          className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink/60 underline-offset-4 transition hover:text-ink hover:underline"
        >
          {copy.viewFashionWeek}
        </Link>
      </div>
    </motion.div>
  );
}

function FieldError({ message }) {
  return message ? <span className="text-xs text-red-700">{message}</span> : null;
}

function TypePicker({ value, onChange, error, copy }) {
  return (
    <div className="space-y-3 md:col-span-2">
      <p className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{copy.projectQuestion}</p>
      <div role="radiogroup" aria-label={copy.quoteTypeAria} className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {quoteTypeList.map((type) => {
          const active = value === type.id;
          const localizedType = copy.typeLabels[type.id] || type;
          return (
            <button
              key={type.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                onChange(type.id);
                trackEvent("devis_type_choisi", { type: type.id });
              }}
              className={`flex h-full flex-col gap-1.5 rounded-inset border px-4 py-3.5 text-left transition-all duration-300 sm:px-5 sm:py-4 ${
                active
                  ? "border-ink bg-ink text-paper shadow-[0_18px_48px_rgba(12,10,8,0.18)]"
                  : "border-line/20 bg-white/60 text-ink hover:border-ink/40 hover:bg-white"
              }`}
            >
              <span className="font-serif text-lg leading-tight sm:text-xl">{localizedType.label}</span>
              <span className={`hidden text-[13px] leading-snug sm:block ${active ? "text-paper/70" : "text-ink/55"}`}>
                {localizedType.description}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}

export default function ContactForm({ type = "" }) {
  const { lang } = useLanguage();
  const copy = CONTACT_FORM_COPY[lang] || CONTACT_FORM_COPY.fr;
  const formRef = useRef(null);
  const [formState, formAction] = useActionState(sendSafely, initialContactFormState);
  const [selectedType, setSelectedType] = useState(getQuoteType(type) ? type : "");
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);
  const [lastState, setLastState] = useState(formState);
  const errors = formState.errors || {};
  const status = formState.status || "idle";
  const message = formState.message || "";
  const showSuccessCard = status === "success" && !isSuccessDismissed;
  const config = getQuoteType(selectedType);
  const localizedConfig = config ? copy.typeLabels[config.id] || config : null;

  function buildSelectOptions(rawValues) {
    return [
      { value: "", label: copy.placeholder },
      ...rawValues.map((val) => ({
        value: val,
        label: copy.optionTranslations[val] || val,
      })),
    ];
  }

  // Modèle React 19 : dériver l'état pendant le rendu.
  // On compare la réponse elle-même et non son statut : deux envois réussis d'affilée doivent chacun être confirmés.
  if (formState !== lastState) {
    setLastState(formState);
    if (status === "success") setIsSuccessDismissed(false);
  }

  // Suivi des demandes de devis : un seul « generate_lead » par envoi réussi, après la réponse
  // positive du serveur. Aucune donnée personnelle : seulement le type de formulaire.
  const reportedLeadRef = useRef(null);
  useEffect(() => {
    if (formState.status !== "success" || reportedLeadRef.current === formState) return;
    reportedLeadRef.current = formState;
    trackEvent("formulaire_envoye", { type: formState.formType, qualification: formState.qualification || "inconnue" });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "generate_lead", form_type: formState.formType });
  }, [formState]);

  // Erreur sur un champ : on amène le premier champ à corriger à l'écran (il peut être loin au-dessus du bouton).
  useEffect(() => {
    if (status !== "error") return;
    const frame = requestAnimationFrame(() => {
      const invalid = formRef.current?.querySelector('[aria-invalid="true"], [data-invalid="true"]');
      if (invalid) centerInView(invalid);
    });
    return () => cancelAnimationFrame(frame);
  }, [formState, status]);

  if (showSuccessCard) {
    return (
      <AnimatePresence mode="wait">
        <SuccessCard key="success" message={message} onReset={() => setIsSuccessDismissed(true)} copy={copy} />
      </AnimatePresence>
    );
  }

  // Avec « action » seule, React 19 vide le formulaire après chaque envoi, même refusé : le visiteur perdrait sa saisie.
  // On déclenche donc l'envoi nous-mêmes ; « action » couvre un envoi fait avant la fin du chargement de la page.
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  const audiences = config?.audiences || [];
  const singleAudience = audiences.length === 1 ? audiences[0] : "";

  return (
    <form
      ref={formRef}
      id="contact-form"
      data-clarity-mask="True"
      action={formAction}
      onSubmit={handleSubmit}
      className="grid scroll-mt-32 gap-5 rounded-inset border border-line/12 bg-white/52 p-6 md:grid-cols-2 md:p-7"
    >
      <input type="hidden" name="type" value={selectedType} />
      <input type="hidden" name="lang" value={lang} />

      <TypePicker value={selectedType} onChange={setSelectedType} error={errors.type} copy={copy} />

      {!config ? (
        <p className="rounded-inset border border-line/10 bg-paper/70 p-5 text-sm leading-relaxed text-ink/65 md:col-span-2">
          {copy.choosePrompt}
        </p>
      ) : (
        <Fragment>
          <div className="space-y-3 rounded-inset border border-line/10 bg-paper/70 p-5 md:col-span-2">
            <p className="text-[11px] uppercase tracking-[0.24em] text-ink/48">
              {copy.quoteRequestPrefix} {localizedConfig.label}
            </p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">{copy.tellMeMore}</h2>
          </div>

          <div key={`audience-${selectedType}`} className="md:col-span-2">
            {singleAudience ? (
              <input type="hidden" name="audience" value={singleAudience} />
            ) : (
              <CustomSelect
                name="audience"
                label={copy.youAre}
                options={buildSelectOptions(audiences)}
                defaultValue=""
                error={errors.audience}
              />
            )}
          </div>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{copy.fullName}</span>
            <input name="name" maxLength={80} autoComplete="name" aria-invalid={Boolean(errors.name)} className={inputClass} required />
            <FieldError message={errors.name} />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{copy.email}</span>
            <input name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={inputClass} required />
            <FieldError message={errors.email} />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{copy.phone}</span>
            <input
              name="phone"
              maxLength={40}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(errors.phone)}
              className={inputClass}
              placeholder={copy.optional}
            />
            <FieldError message={errors.phone} />
          </label>

          {config.fields.map((field) => {
            const fieldLabel = copy.fieldLabels[field.name] || field.label;
            const fieldPlaceholder = copy.fieldPlaceholders[field.name] || field.placeholder;
            return field.kind === "select" ? (
              <div key={`${selectedType}-${field.name}`}>
                <CustomSelect
                  name={`extra_${field.name}`}
                  label={fieldLabel}
                  options={buildSelectOptions(field.options)}
                  defaultValue=""
                  error={errors[field.name]}
                />
              </div>
            ) : (
              <label key={`${selectedType}-${field.name}`} className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{fieldLabel}</span>
                <input
                  name={`extra_${field.name}`}
                  maxLength={120}
                  aria-invalid={Boolean(errors[field.name])}
                  className={inputClass}
                  placeholder={fieldPlaceholder}
                  required={field.required}
                />
                <FieldError message={errors[field.name]} />
              </label>
            );
          })}

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{localizedConfig.dateLabel}</span>
            <input
              name="eventDate"
              type="date"
              min={earliestEventDate()}
              aria-invalid={Boolean(errors.eventDate)}
              className={inputClass}
              required={config.dateRequired}
            />
            <FieldError message={errors.eventDate} />
          </label>

          {config.locationLabel ? (
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{localizedConfig.locationLabel}</span>
              <input
                name="location"
                maxLength={120}
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.location)}
                className={inputClass}
                placeholder={copy.locationPlaceholder}
                required={config.locationRequired}
              />
              <FieldError message={errors.location} />
            </label>
          ) : null}

          <div>
            <CustomSelect
              name="budget"
              label={copy.budgetLabel}
              options={buildSelectOptions(budgetOptions)}
              defaultValue=""
              error={errors.budget}
            />
          </div>

          <div>
            <CustomSelect
              name="source"
              label={copy.sourceLabel}
              options={buildSelectOptions(sourceOptions)}
              defaultValue=""
              error={errors.source}
            />
          </div>

          <label className="space-y-2 md:col-span-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{copy.fiveWordsLabel}</span>
            <input
              name="fiveWords"
              maxLength={120}
              aria-invalid={Boolean(errors.fiveWords)}
              className={inputClass}
              placeholder={copy.fiveWordsPlaceholder}
            />
            <FieldError message={errors.fiveWords} />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/58">{copy.messageLabel}</span>
            <textarea
              name="project"
              rows={6}
              maxLength={2000}
              aria-invalid={Boolean(errors.project)}
              className="w-full rounded-[1.2rem] border border-line/18 bg-paper/88 px-4 py-3 outline-none transition focus:border-accent focus:bg-white"
              placeholder={copy.messagePlaceholder}
              required
            />
            <span className="block text-xs text-ink/45">{copy.messageLimit}</span>
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
                {copy.consentPrefix}{" "}
                <Link href="/confidentialite" className="underline underline-offset-4 hover:text-ink">
                  {copy.privacyLink}
                </Link>
              </span>
            </label>
            <FieldError message={errors.consent} />
          </div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <SubmitButton
              idleLabel={copy.submitIdle}
              pendingLabel={copy.submitPending}
              className="w-fit rounded-full bg-ink px-6 py-3 text-sm uppercase tracking-[0.18em] text-paper transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
            />

            <p className="text-sm text-ink/55">{copy.replyTime}</p>

            {message && status !== "success" ? (
              <p aria-live="polite" className="text-sm text-red-700">
                {message}
              </p>
            ) : null}
          </div>
        </Fragment>
      )}
    </form>
  );
}

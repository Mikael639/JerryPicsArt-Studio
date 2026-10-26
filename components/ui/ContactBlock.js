"use client";

import Link from "next/link";
import TrackedLink from "./TrackedLink";
import { UI_COPY } from "../../lib/i18n";
import { useLanguage } from "../LanguageProvider";

// Bloc de fin de page : un seul appel à l'action principal.
export default function ContactBlock({
  title,
  text,
  label,
  href = "/contact",
  event,
  secondary,
  themeSwitch = false,
}) {
  const { lang } = useLanguage();
  const copy = UI_COPY[lang]?.contactBlock || UI_COPY.fr.contactBlock;
  const resolvedTitle = title || copy.defaultTitle;
  const resolvedText = text || copy.defaultText;
  const resolvedLabel = label || copy.defaultLabel;

  return (
    <section data-theme-section={themeSwitch ? "dark" : undefined} className="mx-auto max-w-7xl px-4 pt-12 md:px-8 md:pt-20">
      <div
        data-cursor-surface="dark"
        className="theme-default relative overflow-hidden rounded-feature border border-line/12 bg-[linear-gradient(135deg,#171310,#302720)] p-8 text-paper shadow-[0_48px_128px_rgba(12,10,8,0.2)] md:p-14"
      >
        <div className="max-w-3xl space-y-6">
          <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-6xl">{resolvedTitle}</h2>
          <p className="max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">{resolvedText}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
            <TrackedLink
              href={href}
              event={event}
              className="inline-block rounded-full bg-paper px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-accent hover:text-paper"
            >
              {resolvedLabel}
            </TrackedLink>
            {secondary ? (
              <Link
                href={secondary.href}
                className="-my-2.5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-paper/70 underline-offset-4 transition-colors hover:text-paper hover:underline"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

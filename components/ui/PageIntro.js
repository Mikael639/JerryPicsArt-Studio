import Link from "next/link";
import Reveal from "./Reveal";
import TrackedLink from "./TrackedLink";

// En-tête de page : H1 unique, accroche, phrase-pont et un seul bouton principal.
export default function PageIntro({ eyebrow, title, lead, bridge, cta, secondary, children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-16">
      <Reveal className="max-w-5xl space-y-6">
        {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/45">{eyebrow}</p> : null}
        <h1 className="font-serif text-5xl leading-[0.94] tracking-[-0.04em] md:text-7xl">{title}</h1>
        {lead ? <p className="max-w-3xl font-serif text-2xl leading-snug text-ink/80 md:text-3xl">{lead}</p> : null}
        {bridge ? <p className="max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">{bridge}</p> : null}
        {cta || secondary ? (
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
            {cta ? (
              <TrackedLink
                href={cta.href}
                event={cta.event}
                className="inline-block rounded-full bg-ink px-8 py-4 text-[13px] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
              >
                {cta.label}
              </TrackedLink>
            ) : null}
            {secondary ? (
              <Link
                href={secondary.href}
                className="text-[13px] font-semibold uppercase tracking-[0.18em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </Reveal>
    </section>
  );
}

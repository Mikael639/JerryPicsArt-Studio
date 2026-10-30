import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SplitTitle from "./SplitTitle";
import TrackedLink from "./TrackedLink";

// En-tête de page : H1 unique, accroche, phrase-pont et un seul bouton principal.
// `image` (optionnel) ajoute une photo à droite sur grand écran, sous le texte sur mobile.
export default function PageIntro({ eyebrow, title, lead, bridge, cta, secondary, image, children }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-16">
      <div className={image ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16" : ""}>
        <Reveal className="max-w-5xl space-y-6">
          {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/45">{eyebrow}</p> : null}
          <SplitTitle text={title} className="font-serif text-5xl leading-[0.94] tracking-[-0.04em] md:text-7xl" />
          {lead ? <p className="max-w-3xl font-serif text-2xl leading-snug text-ink/80 md:text-3xl">{lead}</p> : null}
          {bridge ? <p className="max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">{bridge}</p> : null}
          {cta || secondary ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
              {cta ? (
                <TrackedLink
                  href={cta.href}
                  event={cta.event}
                  className="inline-block whitespace-nowrap rounded-full bg-ink px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-accent min-[400px]:px-7 min-[400px]:text-[12px] min-[400px]:tracking-[0.16em] md:px-8 md:py-4 md:text-[13px] md:tracking-[0.2em]"
                >
                  {cta.label}
                </TrackedLink>
              ) : null}
              {secondary ? (
                <Link
                  href={secondary.href}
                  className="-my-2.5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          ) : null}
          {children}
        </Reveal>

        {image ? (
          // Photo affichée sans glissement ni zoom : hors accueil, aucune animation d'image.
          <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-neutral-900 shadow-[0_24px_80px_rgba(12,10,8,0.14)]">
              <Image
                src={image.src}
                alt={image.alt || ""}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 352px"
                className="object-cover"
                style={{ objectPosition: image.objectPosition || "center center" }}
                quality={75}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

import { siteConfig } from "../../lib/siteConfig";

// Accordéon accessible (<details>) + données structurées FAQPage.
export default function Faq({ items, title = "Questions fréquentes" }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.reponse },
    })),
  };

  return (
    <section aria-label={`${title} — ${siteConfig.name}`} className="mx-auto max-w-4xl px-4 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="font-serif text-4xl leading-[0.96] tracking-[-0.04em] md:text-5xl">{title}</h2>
      <div className="mt-8 divide-y divide-line/12 border-y border-line/12">
        {items.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl tracking-tight text-ink md:text-2xl">
              {item.question}
              <span aria-hidden="true" className="text-ink/40 transition-transform duration-300 group-open:rotate-180">
                ↓
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/70">{item.reponse}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

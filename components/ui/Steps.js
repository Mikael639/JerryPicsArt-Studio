import Reveal from "./Reveal";

// Étapes numérotées (déroulé, process, méthode).
export default function Steps({ steps, tone = "light", columns = "md:grid-cols-4" }) {
  const dark = tone === "dark";

  return (
    <ol className={`grid gap-6 ${columns}`}>
      {steps.map((step, index) => (
        <Reveal
          as="li"
          key={step.titre}
          delay={index * 0.08}
          className={`border-t pt-6 ${dark ? "border-white/15" : "border-line/16"}`}
        >
          <span className={`text-[11px] font-bold uppercase tracking-[0.28em] ${dark ? "text-paper/45" : "text-ink/40"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={`mt-4 font-serif text-2xl leading-tight ${dark ? "text-paper" : "text-ink"}`}>{step.titre}</h3>
          {step.texte ? (
            <p className={`mt-3 text-base leading-relaxed ${dark ? "text-paper/65" : "text-ink/65"}`}>{step.texte}</p>
          ) : null}
        </Reveal>
      ))}
    </ol>
  );
}

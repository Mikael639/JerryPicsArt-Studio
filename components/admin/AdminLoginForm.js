import Link from "next/link";

export default function AdminLoginForm({ authForm, errorMessage, onSubmit, onChange }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center px-4 py-16 md:px-6 md:py-24">
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-ink/45">Espace photographe</p>
        <h1 className="mt-3 font-serif text-4xl leading-[0.96] tracking-[-0.03em] md:text-5xl">
          Administration
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Connectez-vous pour gérer la photothèque, les demandes de devis et les textes du site.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5 rounded-card border border-line/15 bg-white/75 p-6 shadow-[0_24px_70px_rgba(12,10,8,0.06)] backdrop-blur-sm md:p-8"
      >
        <label className="block space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/55">Identifiant</span>
          <input
            value={authForm.username}
            onChange={(event) => onChange("username", event.target.value)}
            autoComplete="username"
            className="w-full rounded-xl border border-line/20 bg-paper/90 px-4 py-3 text-sm outline-none transition focus:border-accent focus:bg-white"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/55">Mot de passe</span>
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => onChange("password", event.target.value)}
            autoComplete="current-password"
            className="w-full rounded-xl border border-line/20 bg-paper/90 px-4 py-3 text-sm outline-none transition focus:border-accent focus:bg-white"
            required
          />
        </label>

        {errorMessage ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800">{errorMessage}</p>
        ) : null}

        <div className="pt-1">
          <button
            type="submit"
            className="w-full rounded-full bg-ink px-8 py-3.5 text-[12px] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
          >
            Se connecter
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Retour au site
        </Link>
      </div>
    </div>
  );
}

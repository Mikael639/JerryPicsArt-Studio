// Fin de page en mode sombre : ThemeScroll assombrit le fond quand ce bloc arrive à l'écran,
// et les couleurs du site (encre, papier, traits) s'inversent à l'intérieur.
export default function DarkChapter({ children, className = "" }) {
  return (
    <div
      data-theme-section="dark"
      className={`dark-chapter space-y-16 pb-20 pt-16 md:space-y-24 md:pt-24 ${className}`}
    >
      {children}
    </div>
  );
}

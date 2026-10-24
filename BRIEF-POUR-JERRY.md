# Brief pour Jerry : où en est le site JerryPicsArt

Ce document est fait pour être lu par Jerry, et collé tel quel à son assistant (Claude) si besoin.
Il résume ce qui a été fait, ce qui reste à décider ou à fournir, ce qu'il faut vérifier, et comment donner des retours utiles.

Date du point : 24 octobre 2026. Dernier état fusionné dans `main` : PR n°27. Un petit correctif (page de chargement) est sur la branche `polish-splash`, en attente de fusion.

---

## 1. Ce que le site est devenu

Site de photographe (mariage, événements, entreprises) avec la Fashion Week comme « signature ». Objectif : donner confiance vite, et mener à une demande de devis.

Pages : Accueil, Signature, Événements, Mariage, Entreprises & lieux, À propos, Contact, mentions légales, confidentialité, pages « collections » créées depuis l'admin.

Technique (pour mémoire) : Next.js, hébergé sur Vercel ; photos sur Cloudflare R2 ; données et textes modifiables dans Supabase ; e-mails via Resend.

## 2. Ce qui a été fait (depuis le brief de Jerry)

**Navigation**
- Ordinateur : 4 liens épurés dans l'en-tête (Signature, Événements, Mariage, Entreprises & lieux) et un bouton « trois traits ». Il ouvre un menu plein écran : prestations numérotées en grand, photo qui change au survol, puis Accueil, À propos, Contact, Instagram, LinkedIn.
- Téléphone : bouton « trois traits » qui ouvre un panneau avec toutes les pages. Le bouton « Demander un devis » reste toujours visible.
- Le menu en barre du bas pour téléphone a été essayé puis abandonné.

**Mouvement**
- Fondu doux entre les pages, titres qui apparaissent mot à mot, photos qui se dévoilent au défilement.
- Chiffres « Repères » (320+, 200+, 15+) qui montent de 0 à leur valeur.
- Bande « Ils sont passés devant mon objectif » : lueurs d'appareil photo discrètes derrière les noms.
- Séries photo : défilé horizontal sur ordinateur (avec bouton pour passer en grille), toujours en grille sur téléphone.
- Page de chargement « JerryPicsArt » une seule fois par visite (trait parasite supprimé).

**Contenu et conversion**
- Une photo d'en-tête à droite du titre sur Signature, Événements, Mariage, Entreprises (photos choisies à la main, voir la section 4).
- Demande de devis par type (mariage, événement, entreprise) avec qualification automatique : « prioritaire », « à qualifier », « hors budget ».
- Téléchargement d'un dossier B2B pour les entreprises.
- Bande de partenaires (logos qui défilent, ralentissent au survol).
- Bascule clair / sombre au fil de la page (pas sur À propos ni Contact).
- Textes sans tirets longs ni formulations « robot », en français, vouvoiement.

**Administration** (`/admin/photos`)
- Onglets toujours visibles, sans défilement horizontal.
- Photothèque par univers et par série, ajout de photos (jusqu'à 12 d'un coup, allégées automatiquement à 2000 px).
- « Textes & réglages » : page d'accueil, À propos, **avis clients, chiffres, références, phrase de contexte de chaque série**, catégories.
- Ajouter une catégorie crée automatiquement une page `/collections/nom`, visible dans le pied de page et le plan du site.
- Zone admin non indexée par Google.
- Import depuis un dossier Google Drive : **codé mais pas encore activé** (il manque une clé Google, voir section 3).

## 3. Ce qu'il faut fournir ou décider (point bloquant pour finir)

1. **Phrases de contexte des séries.** Chaque série affiche un texte « À FOURNIR » tant qu'aucune phrase n'est écrite. À saisir dans l'admin : Textes & réglages, puis « Textes des séries ».
2. **Vrais avis clients.** Ceux affichés sont à valider ou à remplacer (Textes & réglages, « Avis clients »). Ne garder que des avis réels, avec l'accord de la personne.
3. **Photo de Jerry** pour la page À propos.
4. **Mariage : regrouper les photos en 2 ou 3 mariages** (dont Sofitel Le Scribe) pour mieux raconter chaque histoire.
5. **Tarifs d'appel pour Entreprises et shooting studio.** Ceux d'Événements sont affichés : 650 € HT la demi-journée, 1 100 € HT la journée, +200 € HT sélection express le soir même, +450 € HT second photographe. À confirmer.
6. **Bouton de la page Entreprises** : « Réserver un appel de 15 minutes ». À confirmer, ou remplacer.
7. **Politique de confidentialité** : la durée de conservation « 3 ans » a été proposée sans validation. À confirmer ou corriger. Les mentions légales (adresse, statut) sont à relire.
8. **Noms cités dans « Ils sont passés devant mon objectif »** : confirmer que chacun peut y figurer.
9. **Nom de domaine définitif** (pour les liens, le référencement et les e-mails).
10. **E-mails de devis** : vérifier sur Vercel que `CONTACT_TO_EMAIL=jerrypicsart@gmail.com` est bien renseigné, et faire un envoi de test du formulaire.
11. **Google Drive** (facultatif) : créer une clé d'API Google Cloud avec l'API Drive activée, la placer dans `GOOGLE_DRIVE_API_KEY` sur Vercel. Le dossier doit être partagé « Toute personne disposant du lien ». Pas urgent.

## 4. Points à vérifier avec un œil neuf

- **Photos d'en-tête.** Une par page : Signature (défilé Imane Ayissi), Événements (robe blanche brodée, « Fin de passage »), Mariage (silhouette devant une fenêtre, noir et blanc), Entreprises (boutique, Little Africa). Dans le menu, Mariage montre un détail de robe avec alliance. Dire si une autre photo ferait mieux. Le réglage est dans `lib/introPhotos.js`.
- **Catégories de la base.** Dans la catégorie « Mariage », plusieurs photos ressemblent à des soirées ou des galas (tables de réception, invités en tenue de gala). À contrôler : elles risquent d'apparaître sur la page Mariage. Aussi, certains titres de photos ne correspondent pas à l'image (ex. « Detail bijoux »). Pour le référencement, renommer les photos importantes.
- **Diaporama d'accueil** (10 photos max). Il mélange Studio, Mariage, Événements et Fashion Week. Vérifier l'équilibre : l'étiquette à côté suit maintenant la catégorie de la photo.
- **Menu plein écran sur ordinateur.** Il ne met que 4 liens dans la barre du haut. Vérifier qu'un visiteur pressé trouve bien Accueil, À propos et Contact.
- **Bande « Ils sont passés devant mon objectif ».** Les lueurs sont volontairement discrètes. Dire si c'est trop, pas assez, ou si le texte reste facile à lire.
- **Bascule clair / sombre.** Vérifier la lisibilité des cartes de tarifs (la carte « Journée » reste claire au milieu du bloc sombre) et la visibilité du curseur.
- **Textes.** Relire tout le français : accents, ton, promesses (délais, « sélection express », disponibilités). Rien ne doit être inventé.

## 5. Ce qui n'a pas été testé (limites honnêtes)

- Pas testé sur un vrai téléphone (iPhone Safari en particulier) ni sur une vraie tablette. Le balayage au doigt du diaporama d'accueil n'a pas été essayé.
- Les modifications dans l'admin (avis, chiffres, références, textes de séries) n'ont pas été enregistrées pour de vrai pendant les tests, pour ne pas toucher aux données réelles : **à essayer une fois, puis vérifier sur le site**.
- Une catégorie personnalisée et sa page `/collections/…` n'ont pas été testées avec de vraies photos.
- Le temps de chargement n'a pas été mesuré (test Lighthouse à faire).
- L'import Google Drive n'a jamais tourné (pas de clé).
- Les animations (fondus, lueurs, compteurs) ont été vérifiées en mise en page, pas en mouvement réel : à juger à l'œil.
- Des erreurs « 404 » apparaissent parfois dans la console du navigateur en développement ; leur origine n'a pas été identifiée. Elles n'empêchent pas le site de fonctionner.
- Parfois, un déploiement de test (« preview ») sur Vercel échoue à cause du téléchargement de la police Google. Ce n'est pas lié au code : il suffit de cliquer sur « Redeploy ».

## 6. Comment donner ses retours (pour aller vite)

Pour chaque remarque, indiquer :
1. **La page** (et ordinateur ou téléphone).
2. **Ce qui ne va pas**, en une phrase, avec une capture d'écran si possible.
3. **Ce qui serait mieux**, ou « je ne sais pas, à toi de proposer ».
4. **Priorité** : bloquant avant mise en ligne, important, ou confort.

Les retours peuvent être regroupés dans une liste numérotée. Les questions de contenu (section 3) sont à traiter en premier : ce sont elles qui empêchent de finir.

## 7. Ce qu'on ne doit pas faire

- Ne pas écrire de chiffres, de clients, de prix ou d'avis non vérifiés.
- Ne pas partager les mots de passe ou les clés (administration, Supabase, Resend, R2, Google) dans une conversation ni dans le code.
- Ne pas supprimer ou renommer les catégories d'origine (Signature, Événements, Mariage, Studio) : le site s'appuie dessus. Seules les catégories ajoutées par Jerry peuvent être retirées.

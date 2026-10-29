import { UNIVERS_PHOTOS } from "./universPhotos";

// Univers : sélections courtes tirées de plusieurs shootings (annexe A du brief, sélection du 29 octobre 2026).
// Signature, Événements et Entreprises & lieux n'affichent que ces photos, dans cet ordre.
// Les photos viennent du Drive de Jerry et sont copiées sur R2 par scripts/import-univers.mjs.
const UNIVERS = [
  {
    page: "signature",
    slug: "defiles",
    court: { fr: "Défilés", en: "Runways" },
    titre: { fr: "Défilés & haute couture", en: "Runways & haute couture" },
    credits: "Georges Chakra · Elie Saab · Imane Ayissi · Amiri · KidSuper",
    contexte: {
      fr: "Les défilés de la Fashion Week et de la Haute Couture, du podium aux salons.",
      en: "Fashion Week and Haute Couture shows, from the runway to the salons.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1tN4RTkjo-8PvjEqdWCHFF47dAPI_sjXK", "Robe noire à traîne devant une grille, Semaine de la Haute Couture, Paris"],
      ["1JM0EFp4uNKKeTUy6ZtmO_F4E27eMYd10", "Robe noire sculptée au défilé Georges Chakra, Haute Couture, Paris"],
      ["13PvRdltJ0pnPu-ivCQefRyVCuVTQSJWU", "Passage d'une robe verte sous les lustres, défilé Imane Ayissi, Haute Couture, Paris"],
      ["1Nwg_SqEsJQmGgLAJaWqpaEV7b_sDeJSV", "Mannequin en tailleur sur le podium, Paris Fashion Week, mars 2026"],
      ["1fvZbabbBH7MzGmPZgSujgIJ2RsLYAVUc", "Silhouette en cuir sur le podium, Paris Fashion Week, mars 2026"],
      ["1t7hp0xMd-Foyd_BRmRDbm4B6329uXfBS", "Passage en mouvement sur le podium, Paris Fashion Week, mars 2026"],
      ["1p_0HTpASuYRQ8LIK7IF5hsPIm3RiCaxi", "Manteau de fourrure dorée sur le podium, défilé à Paris"],
      ["1YmA3P77P7SI-1j7IdYoRrlq_TjEM3y1O", "Manteau léopard sous une pluie de neige, défilé D in Paris"],
      ["1CjxbDyoVF0NqmABkpfYhBcczopPtcJBy", "Silhouette blanche dans la fumée, défilé KidSuper, Paris"],
      ["1fzh6T61U-ShT_B57AQ4XCIdBWhp9CBgs", "Détail d'une boucle d'oreille dorée, Semaine de la Haute Couture, Paris"],
      ["1OY-f6YZtWjRy4xfD88mJz5hmerGl8B14", "Robe de bal brodée dans un salon doré, Paris Fashion Week"],
      ["1Ab6VghmofMyNg5rSrKmpCK5uDKxc1TLf", "Silhouette devant une bibliothèque, défilé Amiri, Paris"],
      ["1Omk0BmjPe8qQSB7DuoXdkcDKuYTFFx3d", "Robe blanche sculptée, Semaine de la Haute Couture, Paris"],
      ["1uEvmuufB3nK8AiGc3XTuJVQihJMTBCgd", "Deux silhouettes en pose longue, défilé D in Paris"],
    ],
  },
  {
    page: "signature",
    slug: "personnalites",
    court: { fr: "Personnalités", en: "Public figures" },
    titre: { fr: "Personnalités", en: "Public figures" },
    credits: "Michael Rainey Jr · Davido · Djany · Denzel Ward · Jerami Grant · Kristy Sarah",
    contexte: {
      fr: "Artistes, sportifs et invités, saisis au premier rang ou en coulisses.",
      en: "Artists, athletes and guests, caught front row or backstage.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1iE1HUOZyf9DrdHzV5FhpsxB6opX-GErW", "Denzel Ward au défilé Amiri, Paris"],
      ["17JxSRNuyYSEsltZnFSjG1bTMmrK-E7rG", "Portrait dans un fauteuil Chesterfield rouge, soirée Amiri, Paris"],
      ["1w6vIu9BfXIVSWQt6OuhJnNHCKAh3h_Pb", "Michael Rainey Jr. interviewé pendant la Paris Fashion Week"],
      ["1VtgRjLk59ymHGdPKFlXcKHgzeS0k-KMq", "Combinaison de pilote et montgolfières au défilé KidSuper, Paris"],
      ["10DPyNB6bpgJ48SDswFLzsdf82vw1kZEM", "Jerami Grant au défilé KidSuper, Paris"],
      ["15cdjHPLzWiPPs51gFUtWsZtgwJT9pf_V", "Davido dans une rue de Paris pendant la Fashion Week"],
      ["1ktyfuSMHhTBzbwcNBa_KP5VAlbZNXoLn", "Djany sur le tapis rouge de la cérémonie Les Flammes 2026"],
      ["122oP75-C7r7UxG-NpBgsO52snShW6hyc", "Bouquet de fleurs rouges et coiffure afro, Paris Fashion Week, octobre 2025"],
      ["1Pm0P-5QgRaEjU7L-eoAjc5ckizCGGm0I", "Robe blanche devant une porte cochère, défilé Georges Chakra, Paris"],
      ["184XPapIAUOeU8Sryu2P7587M-fqE4Gbv", "Kristy Sarah en robe noire, Paris Fashion Week"],
      ["1j0R9trRPN5pB1JI8oDzXAUsbh_3jEFn-", "Look rouge et rose face aux photographes, défilé Casablanca, Paris"],
      ["15JDSHqzDElY3qpkh4f06iMsEJs8kTosp", "Robe beige ceinturée au défilé Elie Saab, Haute Couture, Paris"],
      ["1rOWMjbwRrZnn3kWRf3zyj9s8HO-kXxH9", "Costume noir brodé au premier rang du défilé Amiri, Paris"],
    ],
  },
  {
    page: "signature",
    slug: "editorial",
    court: { fr: "Éditorial", en: "Editorial" },
    titre: { fr: "Éditorial", en: "Editorial" },
    credits: "Magnum Online · InterContinental Paris",
    contexte: {
      fr: "Séries éditoriales, de la Côte d’Azur aux toits de Paris.",
      en: "Editorial series, from the French Riviera to the rooftops of Paris.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1d2a5atmgoJH-lC728PyUMc2yMKV3_mCp", "Robe de satin bleu déployée, série éditoriale à Paris"],
      ["1t3HNEFcgkXt2dCH7MdnkRnZIwrOn81lX", "Robe de tulle verte dans un salon, série éditoriale à Paris"],
      ["1woJyoOl60UCLtxw74nuNF_cjClaR86-I", "Chemise jaune et voiture ancienne, série Magnum Online sur la Côte d'Azur"],
      ["1T8wZg6qB2F4l6mdf54LClfcELWDsG4Wl", "Gilet ouvert face aux falaises, série Magnum Online sur la Côte d'Azur"],
      ["1uVaG9HJPZdWiRM1QuFn5rthJZ9vjLGZG", "Robe à pois sur fond bleu, portrait éditorial en studio"],
      ["1UfhdNPBRY_x4o5-J6PQiqfyQYg_O1dB6", "Portrait en tissu wax et bracelets, série éditoriale Origines"],
      ["1uDZXCcAoyeRqvhojBjIhe7lE1Wlx5_cZ", "Portrait en noir et blanc dans une boutique, série Little Africa, Paris"],
      ["1Kl9hpffVnm1a4x2fHZWQtoW3RXYh5b_N", "Robe noire et lunettes de soleil, série éditoriale en intérieur"],
      ["1YqTwogtf1Jzyfbaw56mMu_HC6YFtEn59", "Portrait aux yeux fermés sur fond bleu, série éditoriale en studio"],
      ["1epHpq_h4bHQhJdggeBDiUd_7yWBdNMoS", "Manteau de fourrure et lunettes rouges sur un balcon, Paris"],
      ["1I_kJ-HA63Ge-mWCyGHRvod4j6Z7CmOrY", "Silhouette face aux falaises, série Magnum Online sur la Côte d'Azur"],
      ["1xuyexb0dnGoLACo3Iv0HEHGukLGP2b8_", "Chemise jaune sous les palmiers, série Magnum Online sur la Côte d'Azur"],
      ["1ZW68YG7hJp5_kbv6aS5GXu6py20ia1Uz", "Robe de satin bleu sous le ciel, série éditoriale"],
    ],
  },
  {
    page: "signature",
    slug: "campagnes",
    court: { fr: "Campagnes", en: "Campaigns" },
    titre: { fr: "Campagnes de marque", en: "Brand campaigns" },
    credits: "Galeries Lafayette · Printemps · Africa Now",
    contexte: {
      fr: "Images commandées par des enseignes et des marques, prêtes à publier.",
      en: "Images commissioned by retailers and brands, ready to publish.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1BVQcfOb8JgE_Ngnl7H2clcoLvzqwNrX0", "Olivia Yacé sur un toit de Paris, campagne Africa Now pour les Galeries Lafayette"],
      ["1EWAazGS7QHfq-Prbg6u2kesh7Twp5HzJ", "Olivia Yacé face à la tour Eiffel, campagne Africa Now, Galeries Lafayette"],
      ["1zTXICW3hWVtmN86PlsA8xQAn7b00TslA", "Olivia Yacé en noir et blanc, campagne Africa Now, Galeries Lafayette"],
      ["1kZl2nn7ZsLxmDzdcL5C1snUKjSc4bE1i", "Robe rouge en mouvement, shooting Diaka Camara pour le Printemps, Paris"],
      ["15qoJmgWk2pxyK7IHkRzwqdDa6e1Kz2Nn", "Robe rouge devant une fenêtre, shooting Diaka Camara pour le Printemps"],
      ["1OJvm9_XY2xbE__APKD4V-YYoQZnL-5Kf", "Portrait en noir et blanc, shooting Diaka Camara pour le Printemps, Paris"],
      ["1qDHleRl89AfxBmlHOtM6tcTsP259kbll", "Escarpins noirs, campagne pour une marque de chaussures"],
      ["1XTxsq2NN1co5XDuDeqAMoi3CSG9-BOmB", "Jambes et escarpins sur un canapé, campagne pour une marque de chaussures"],
      ["15BwI_4AxqobLZzBm1ydcACYYBDfOWhE3", "Paire d'escarpins en reflet, photographie produit en studio"],
      ["161XgUsNazWe4YrBgBMmpihow-YWlKSoE", "Mule bordeaux sur un socle blanc, photographie produit en studio"],
    ],
  },
  {
    page: "signature",
    slug: "sport",
    court: { fr: "Sport", en: "Sport" },
    titre: { fr: "Sport & vitesse", en: "Sport & speed" },
    credits: "Grand Prix de Monaco · Jubilé Robert Pirès · Thierry Henry · Samuel Eto’o",
    contexte: {
      fr: "Le Grand Prix de Monaco vu du ciel et les légendes du football au Jubilé Pirès.",
      en: "The Monaco Grand Prix from above, and football legends at the Pirès Jubilee.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["15HW6cU7mSmgJ4kpCIZxZsK3zpCkcpVWn", "Monoplace vue du ciel au bord de l'eau, Grand Prix de Monaco"],
      ["1D2SkmLzEw8CKV3BxpklLJi2gq3YvigC7", "Monoplace entre les arbres vue d'en haut, Grand Prix de Monaco"],
      ["158oa40kQhtQdtBxNC0iV5KeIAQCg4udo", "Ligne droite du circuit vue du ciel, Grand Prix de Monaco"],
      ["10f-B0qg1JW9sFqX-cd3LYT4mTpbZeIWz", "Denzel Ward, joueur de football américain, au défilé Amiri, Paris"],
      ["1IYzmwOZXjtW4KodPqeu2BX87AI94soGF", "Samuel Eto'o et d'anciens internationaux sur la pelouse, Jubilé Robert Pirès"],
      ["1o8SAZxbXStBBdUW2vRvnIJOm9HRdDiEJ", "Samuel Eto'o en discussion sur la pelouse, Jubilé Robert Pirès"],
      ["1XkmBACuBUwY8w6yACV8Zq4JNSs0xf0Jq", "Samuel Eto'o et d'anciens internationaux avant le match, Jubilé Robert Pirès"],
      ["1-lGFwdpq70K-bIeoI8HO67DfJS065Iui", "Joueur saluant le public au Jubilé Robert Pirès"],
    ],
  },
  {
    page: "evenements",
    slug: "monaco-culture",
    court: { fr: "Monaco & culture", en: "Monaco & culture" },
    titre: { fr: "Grand Prix de Monaco & culture", en: "Monaco Grand Prix & culture" },
    credits: "Expérience Orun · Beluga × Monaco · Manifeste · La Conversation",
    contexte: {
      fr: "L’expérience Orun au Grand Prix de Monaco, et des rencontres culturelles à Paris.",
      en: "The Orun experience at the Monaco Grand Prix, and cultural talks in Paris.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1pjp5Mqgr6kOHl1Kof7MgaFtAho7qsfY9", "Invités sur le pont d'un yacht, expérience Orun au Grand Prix de Monaco"],
      ["13W8E9FXBnPUOEcXuo-73Wx7JxWUt2e5J", "DJ aux platines Beluga, expérience Orun à Monaco"],
      ["1gL076LuO7DOte-Wf8q11CW-95WGOhZpb", "Prise de parole lors d'une rencontre Manifeste 2026, Paris"],
      ["168V86C9KNhocSVgBlrwubcLyFaTeCbbG", "Fauteuil club et lunettes noires, soirée Amiri, Paris"],
      ["1s-v8PMyWmchCDHiKRn5FdCsbcq0Llj5i", "Diaka Camara lors de La Conversation Paris 2026"],
    ],
  },
  {
    page: "evenements",
    slug: "diners",
    court: { fr: "Dîners & soirées", en: "Dinners & parties" },
    titre: { fr: "Dîners & soirées privées", en: "Dinners & private parties" },
    credits: "The Builders’ Tables · Mboa Paris · Nubiance × Sheek · Taptap Send",
    contexte: {
      fr: "Dîners privés et soirées de marque, de la table dressée aux invités.",
      en: "Private dinners and brand evenings, from the set table to the guests.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1YxWN4ekKzjNblonbAENwyAiLZf_tYv7U", "Robe ivoire face à la tour Eiffel, gala Mboa Paris 2025"],
      ["15s4J5vPzjpKylH7Q1hTeNm7ce41AVnXd", "Longue table dressée, dîner The Builders' Tables, Paris"],
      ["1OaqAH4LrO_GvnLacxW7hrds5-vpBerIa", "Bougies et verres sur la table, dîner The Builders' Tables"],
      ["1u1uue8-mTm_oa1RW6acR4A9OLy-VKH3M", "Portrait en veste noire, dîner The Builders' Tables, Paris"],
      ["1ZcpSatnT_WO1wrGYjmG3ZlSdKl9O0Gz5", "Invités réunis dans un salon, dîner The Builders' Tables, Paris"],
      ["1oq7-HRQ7I_aPbZlWynaNNEujbYl5AWcD", "Deux invités devant une porte-fenêtre, dîner de mode Mboa Paris"],
      ["12nXZ1DruXOxyRvp1Qoqj1Nw8ScxXXTG5", "Arrivée d'un invité en noir, dîner de mode privé Mboa Paris"],
      ["1zKmrCpWvvN1eOpUbPsAew8Tr8R1jHc_F", "Deux invités devant le décor rose, Pink Table de Taptap Send"],
      ["1SMaGThrFmUy8CahKoDbfebB0viKNCqVh", "Portrait dans un salon aux murs rouges, soirée Beyond The Glow de Nubiance et Sheek"],
      ["1MOQpwPllmBSeJyzEdvw0TDpT8cI8Pwi8", "Assiette dressée vue du dessus, dîner Beyond The Glow, Nubiance et Sheek"],
      ["1pzfU4w035Dqgkd0ZhWZ52kWsR1IvlDfo", "Table de banquet aux banquettes rouges, dîner Beyond The Glow, Paris"],
      ["1O5n8gg_Y4aqhvLzTWc838uYVcnHl-EYj", "Menu bordeaux sur une assiette en faïence, dîner Beyond The Glow"],
      ["1cxaE4CLIO74PCPP3Rh7wU6uxhb7Q8-9C", "Menu et couverts dressés, dîner de mode privé Mboa Paris"],
      ["1rXT-i8rik0su2Rfk2mDU4497HT6Fs4_n", "Couvert et menu bordeaux, dîner Beyond The Glow de Nubiance et Sheek"],
      ["1W_wLodm8VIHDDDYQHQ1IAk66WakDmZO0", "Longue table sous une lumière rouge, dîner de mode privé Mboa Paris"],
      ["1-BHyNXP2PIW2JihZV9LPEfBclEhFTiJJ", "Salle de banquet dressée avant l'arrivée des invités, dîner Beyond The Glow"],
    ],
  },
  {
    page: "evenements",
    slug: "scenes",
    court: { fr: "Scènes & tapis rouges", en: "Stages & red carpets" },
    titre: { fr: "Scènes & tapis rouges", en: "Stages & red carpets" },
    credits: "Fally Ipupa au Stade de France · Les Flammes · Rumba Royale · Joya",
    contexte: {
      fr: "Concerts, cérémonies et avant-premières, de la scène au tapis rouge.",
      en: "Concerts, ceremonies and premieres, from the stage to the red carpet.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1OtubjvA2ECnHOVJhAzHN6zIayOR-doYS", "Concert de Fally Ipupa au Stade de France, flammes sur scène"],
      ["1JOQpLqlUTfJ7nvUP1RYS5kf3QcaIUX0R", "Djany sur le tapis rouge, cérémonie Les Flammes 2026"],
      ["1KHXRRG724QFUJCPcaH_GBEDN-_-DOYmh", "Artiste devant le mur de la cérémonie Les Flammes 2025"],
      ["1LIye2k1qJX8n8vLl5jSRCh31XJ1Xe1mW", "Tapis rouge de l'avant-première du film Rumba Royale, Paris"],
      ["1oqkyKc6XBq-BBmTtom2tvnsPa4kTmWZy", "Duo sur le tapis rouge de l'avant-première Rumba Royale, Paris"],
      ["1k_M8xEOuce6ZUz6lhyNqmTDI8jGNe0Qk", "Robe dorée dos nu dans un salon, soirée D in Paris"],
      ["1qDnmoNx0Qbapcm-WabvrTSisc7_cnpK9", "Veste en tweed sur le tapis rouge de l'avant-première Joya, Paris"],
      ["1MPzhHPW7RZaCUVK44jPHajWMNhEu2BaS", "Échange devant le rideau rouge, avant-première Joya, Paris"],
      ["1J0AIMw0VPHYJy53I8zjeWiWbLRWd6XTz", "Deux artistes devant le mur de la cérémonie Les Flammes 2025"],
      ["1ia8NFRU_HgQMMbKAnlKre7SiEJxpWYH9", "Mise en scène lumineuse du concert de Fally Ipupa, Stade de France"],
      ["12SVSVP9ZrZ80ePba4rWb_gFQeM7hspDM", "Duo sur scène lors du concert de Fally Ipupa, Stade de France"],
      ["1I0ngShEewpim4K31yrsT8Qma84QXaLC3", "Pose sur le tapis de la cérémonie Les Flammes 2025"],
    ],
  },
  {
    page: "entreprises",
    slug: "institutions",
    court: { fr: "Institutions", en: "Institutions" },
    titre: { fr: "Institutions, galas & conférences", en: "Institutions, galas & conferences" },
    credits: "UNESCO · Quai des futurs · Euridis · Africa Day",
    contexte: {
      fr: "Conférences, remises de diplômes et rencontres institutionnelles.",
      en: "Conferences, graduation ceremonies and institutional events.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1M8UNfQSlWujOkn-Rak1I3N80NboSg0XA", "Discours au pupitre de l'UNESCO, drapeaux de l'Union africaine et des Nations unies"],
      ["1F4cAPfwGAlYZYgkjBS8vE2lRAI6WV0UU", "Invité en costume lors de la rencontre Bâtir des ponts, Paris"],
      ["1pLMQcXgtTX0EMcQyQ65ejmBcIzlNSpJy", "Photo de groupe dans un jardin, rencontre Quai des futurs"],
      ["1x3nhnEvyOvIWJzFlAAJokPGqEPOx5nZV", "Étudiants diplômés au gala Euridis 2026"],
      ["11mUj87hxyrh_wc4VgjgJOrz4yry-AxLt", "Portrait en toge et toque de diplômé, gala Euridis"],
      ["1_baxTg6z5G4qjzRn9wJJNtK43O5Jhyl2", "Table ronde lors du Concerto VIP de l'Africa Day"],
      ["1TMYQBq9IkQaKxm1TyB-j9bqt7hjlsRsG", "Entretien lors d'une présentation de livre, Paris"],
      ["1cPl5TSDdiCsMXZFkEubpLYP8PVftaE8G", "Intervenant sur scène, micro en main, Africa Day"],
      ["19RWqsqwGZFkW6fD-rudXHicgKvDmXl3T", "Salle de conférence comble, Concerto VIP de l'Africa Day"],
      ["1gvBhD-F6DfwsLhaNhYDBVKjNapfSvkMQ", "Poignée de main sur un perron, rencontre Quai des futurs"],
      ["1TAlB7YmPVuXfFKDyUGTaMbvkN_MpleHs", "Échange entre deux invités dans un jardin, Quai des futurs"],
      ["1fy4AG6hGq7WWrx0jTqjteRQRtiHWeq5E", "Scène de l'UNESCO et rangée de drapeaux, conférence à Paris"],
    ],
  },
  {
    page: "entreprises",
    slug: "marques-cannes",
    court: { fr: "Marques & Cannes", en: "Brands & Cannes" },
    titre: { fr: "Marques, équipes & Cannes", en: "Brands, teams & Cannes" },
    credits: "Festival de Cannes · Decathlon · Valéo · Espace Grand Paris · MLK Business",
    contexte: {
      fr: "Contenus de marque, portraits d’équipe et présence au Festival de Cannes.",
      en: "Brand content, team portraits and the Cannes Film Festival.",
    },
    // [identifiant Google Drive, texte alternatif]. La première photo est la couverture.
    photos: [
      ["1y1bwHk4EnQKF-x_CA-3YHP39ytHJrArI", "Plage privée et parasols sur la Croisette, Festival de Cannes"],
      ["1WjybF4T9ByHi38z_CUuvuENF-upmJP_b", "Yachts et ponton dans la baie de Cannes pendant le Festival"],
      ["1JbYB0x08cKvMYrK0MvBiZ5ArToK1bBei", "La Croisette et ses palmiers pendant le Festival de Cannes"],
      ["1WKNlmllTG6-7uCZaK7pIG_zVNO5H9w15", "Portrait d'équipe en noir, shooting commercial Espace Grand Paris"],
      ["1tVsKf25eqW5L6Ob9_pGY7byW5ExzDdJD", "Portrait professionnel bras croisés, shooting commercial Espace Grand Paris"],
      ["1uxiIzM9z_XnzpUSWN2wdwQNsRKjDbBz2", "Salle de convention éclairée, événement Decathlon organisé par Espace Grand Paris"],
      ["1uHouCUT7cnWV47hbGnmFppGLb0NWdNBa", "Photo d'équipe en chemises blanches dans un parc, Atelier A Concept"],
      ["1kgoXaiybOld-sfCp4lNmi5TSiT865T0I", "Stand d'exposant au salon MLK Business, mai 2026"],
      ["1S6d9rZAOtc-27J3FpmsnQEM32GrJ7GRe", "Intervenant sur scène lors d'une conférence Valéo, événement Espace Grand Paris"],
    ],
  },
];

// Légendes courtes (version abrégée des textes alternatifs), uniquement quand la photo nomme une personne, une maison
// ou un lieu. Même ordre que les photos de chaque univers ; une chaîne vide = pas de légende.
const LEGENDES = {
  "defiles": [
    "Semaine de la Haute Couture, Paris",
    "Défilé Georges Chakra, Haute Couture",
    "Défilé Imane Ayissi, Haute Couture",
    "Paris Fashion Week, mars 2026",
    "Paris Fashion Week, mars 2026",
    "Paris Fashion Week, mars 2026",
    "",
    "Défilé D in Paris",
    "Défilé KidSuper, Paris",
    "Semaine de la Haute Couture, Paris",
    "Paris Fashion Week",
    "Défilé Amiri, Paris",
    "Semaine de la Haute Couture, Paris",
    "Défilé D in Paris",
  ],
  "personnalites": [
    "Denzel Ward, défilé Amiri",
    "Soirée Amiri, Paris",
    "Michael Rainey Jr, Paris Fashion Week",
    "Défilé KidSuper, Paris",
    "Jerami Grant, défilé KidSuper",
    "Davido, Paris Fashion Week",
    "Djany, Les Flammes 2026",
    "Paris Fashion Week, octobre 2025",
    "Défilé Georges Chakra, Paris",
    "Kristy Sarah, Paris Fashion Week",
    "Défilé Casablanca, Paris",
    "Défilé Elie Saab, Haute Couture",
    "Défilé Amiri, Paris",
  ],
  "editorial": [
    "",
    "",
    "Magnum Online, Côte d'Azur",
    "Magnum Online, Côte d'Azur",
    "",
    "Série Origines",
    "Série Little Africa, Paris",
    "",
    "",
    "",
    "Magnum Online, Côte d'Azur",
    "Magnum Online, Côte d'Azur",
    "",
  ],
  "campagnes": [
    "Africa Now × Galeries Lafayette, avec Olivia Yacé",
    "Africa Now × Galeries Lafayette, avec Olivia Yacé",
    "Africa Now × Galeries Lafayette, avec Olivia Yacé",
    "Diaka Camara pour le Printemps",
    "Diaka Camara pour le Printemps",
    "Diaka Camara pour le Printemps",
    "",
    "",
    "",
    "",
  ],
  "sport": [
    "Grand Prix de Monaco",
    "Grand Prix de Monaco",
    "Grand Prix de Monaco",
    "Denzel Ward, défilé Amiri",
    "Jubilé Robert Pirès",
    "Jubilé Robert Pirès",
    "Jubilé Robert Pirès",
    "Jubilé Robert Pirès",
  ],
  "monaco-culture": [
    "Expérience Orun, Grand Prix de Monaco",
    "Beluga × Monaco",
    "Manifeste 2026",
    "Soirée Amiri, Paris",
    "La Conversation, Paris 2026",
  ],
  "diners": [
    "Gala Mboa Paris 2025",
    "The Builders' Tables",
    "The Builders' Tables",
    "The Builders' Tables",
    "The Builders' Tables",
    "Private Fashion Dinner, Mboa Paris",
    "Private Fashion Dinner, Mboa Paris",
    "Pink Table, Taptap Send",
    "Beyond The Glow, Nubiance × Sheek",
    "Beyond The Glow, Nubiance × Sheek",
    "Beyond The Glow, Nubiance × Sheek",
    "Beyond The Glow, Nubiance × Sheek",
    "Private Fashion Dinner, Mboa Paris",
    "Beyond The Glow, Nubiance × Sheek",
    "Private Fashion Dinner, Mboa Paris",
    "Beyond The Glow, Nubiance × Sheek",
  ],
  "scenes": [
    "Fally Ipupa, Stade de France",
    "Djany, Les Flammes 2026",
    "Les Flammes 2025",
    "Avant-première Rumba Royale",
    "Avant-première Rumba Royale",
    "Soirée D in Paris",
    "Avant-première Joya",
    "Avant-première Joya",
    "Les Flammes 2025",
    "Fally Ipupa, Stade de France",
    "Fally Ipupa, Stade de France",
    "Les Flammes 2025",
  ],
};

export const PAGE_PATHS = { signature: "/signature", evenements: "/evenements", entreprises: "/entreprises" };

export function localize(value, lang) {
  if (!value || typeof value === "string") return value || "";
  return value[lang] || value.fr;
}

function withImages(univers) {
  const titre = univers.titre.fr;
  const images = univers.photos
    .map(([driveId, alt]) => ({ driveId, alt, ...UNIVERS_PHOTOS[driveId] }))
    .filter((photo) => photo.src)
    .map(({ driveId, alt, src, width, height }, index) => ({
      id: driveId,
      src,
      alt,
      caption: LEGENDES[univers.slug]?.[index] || "",
      width,
      height,
      title: titre,
    }));

  return {
    page: univers.page,
    slug: univers.slug,
    court: univers.court,
    titre: univers.titre,
    credits: univers.credits,
    contexte: univers.contexte,
    couverture: images[0] || null,
    images,
  };
}

// Les 10 univers tels qu'importés du Drive (annexe A), sans modification de l'administration.
export function getUniversList() {
  return UNIVERS.map(withImages);
}

// Applique les modifications faites depuis l'administration (textes, ordre, photos masquées,
// couverture, textes alternatifs) à un univers tel que renvoyé par getUniversList/withImages.
export function applyUniversOverride(univers, override) {
  if (!override) return univers;

  let images = univers.images;
  if (override.hidden?.length) {
    const hidden = new Set(override.hidden);
    images = images.filter((image) => !hidden.has(image.id));
  }
  if (override.order?.length) {
    const byId = new Map(images.map((image) => [image.id, image]));
    const ordered = override.order.map((id) => byId.get(id)).filter(Boolean);
    const rest = images.filter((image) => !override.order.includes(image.id));
    images = [...ordered, ...rest];
  }
  if (override.alt) {
    images = images.map((image) => (override.alt[image.id] ? { ...image, alt: override.alt[image.id] } : image));
  }

  const couverture = (override.cover && images.find((image) => image.id === override.cover)) || images[0] || null;

  return {
    ...univers,
    titre: override.titre ? { fr: override.titre, en: univers.titre.en } : univers.titre,
    credits: override.credits || univers.credits,
    contexte: override.contexte ? { fr: override.contexte, en: univers.contexte.en } : univers.contexte,
    couverture,
    images,
  };
}

export function withUniversOverrides(universList, overrides) {
  return universList.map((univers) => applyUniversOverride(univers, overrides?.[univers.slug]));
}

// Univers d'une page (« signature », « evenements », « entreprises »), dans l'ordre d'affichage.
// Sans les modifications de l'administration : lib/loadUnivers.js les applique pour les pages du site.
export function getUniversForPage(page) {
  return getUniversList()
    .filter((univers) => univers.page === page)
    .filter((univers) => univers.images.length);
}

// Accueil : une couverture par univers, chacune mène à l'univers sur sa page.
export function getUniversCovers() {
  return getUniversList()
    .filter((univers) => univers.couverture)
    .map((univers) => ({
      slug: univers.slug,
      href: `${PAGE_PATHS[univers.page]}#${univers.slug}`,
      titre: univers.titre,
      cover: univers.couverture,
    }));
}

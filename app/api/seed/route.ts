import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ARTICLES = [
  // ── IMMOBILIER ──────────────────────────────────────────────────
  {
    category: "Immobilier",
    catSlug: "immobilier",
    title: "Comment calculer le rendement locatif de votre bien",
    slug: "calculer-rendement-locatif",
    imageUrl: "https://picsum.photos/seed/rendement-locatif/1200/630",
    metaDescription: "Découvrez comment calculer précisément le rendement locatif brut et net de votre investissement immobilier pour optimiser votre patrimoine.",
    content: `<h2>Qu'est-ce que le rendement locatif ?</h2>
<p>Le rendement locatif mesure la rentabilité d'un investissement immobilier en comparant les revenus annuels générés par le loyer au prix d'achat du bien. C'est l'indicateur clé que tout investisseur doit maîtriser avant d'acquérir un bien.</p>
<p>Il existe deux types de rendement : le rendement brut, simple à calculer, et le rendement net, qui prend en compte les charges et la fiscalité.</p>

<h2>Calculer le rendement brut</h2>
<p>La formule est simple :</p>
<ul>
<li>Rendement brut = (Loyer annuel / Prix d'achat) × 100</li>
</ul>
<p>Par exemple, pour un appartement acheté 150 000 € avec un loyer mensuel de 700 €, le rendement brut sera : (700 × 12 / 150 000) × 100 = <strong>5,6 %</strong>.</p>

<h2>Calculer le rendement net</h2>
<p>Le rendement net est plus précis. Il tient compte de toutes les charges :</p>
<ul>
<li>Taxe foncière</li>
<li>Charges de copropriété non récupérables</li>
<li>Frais de gestion (si agence)</li>
<li>Assurance propriétaire non occupant</li>
<li>Provisions pour travaux et vacance locative</li>
</ul>
<p>Rendement net = ((Loyer annuel - Charges annuelles) / Prix d'achat total) × 100</p>

<h2>Les zones géographiques les plus rentables</h2>
<p>En France, les rendements varient considérablement selon les villes. Les grandes métropoles comme Paris offrent des rendements plus faibles (2 à 4 %) en raison de prix élevés, tandis que des villes moyennes comme Mulhouse, Le Mans ou Limoges peuvent atteindre 7 à 10 %.</p>

<h2>Les erreurs à éviter</h2>
<p>De nombreux investisseurs font l'erreur de ne regarder que le rendement brut. Pensez toujours à intégrer la vacance locative, estimée en moyenne à 1 mois par an, ainsi que les éventuels travaux de rénovation.</p>

<h2>Conclusion</h2>
<p>Un bon rendement locatif se situe généralement entre 5 et 8 % net. Au-delà, vérifiez que le bien ne présente pas de risques cachés (emplacement difficile, état dégradé). En dessous de 4 %, l'investissement peut encore être intéressant si vous misez sur la plus-value à long terme.</p>`,
  },
  {
    category: "Immobilier",
    catSlug: "immobilier",
    title: "Les étapes clés pour acheter un appartement",
    slug: "etapes-acheter-appartement",
    imageUrl: "https://picsum.photos/seed/acheter-appartement/1200/630",
    metaDescription: "De la recherche du bien à la signature chez le notaire, suivez les étapes essentielles pour réussir votre achat immobilier.",
    content: `<h2>Étape 1 : Définir votre budget</h2>
<p>Avant toute recherche, évaluez votre capacité d'emprunt en consultant votre banque ou un courtier. Intégrez les frais de notaire (environ 7-8 % dans l'ancien, 2-3 % dans le neuf) et les éventuels travaux.</p>

<h2>Étape 2 : Définir vos critères de recherche</h2>
<p>Établissez une liste claire de vos besoins :</p>
<ul>
<li>Localisation (ville, quartier, proximité des transports)</li>
<li>Surface et nombre de pièces</li>
<li>Étage et exposition</li>
<li>Présence d'un parking, d'une cave ou d'un balcon</li>
</ul>

<h2>Étape 3 : La recherche active</h2>
<p>Multipliez les sources : agences immobilières, sites en ligne (SeLoger, LeBonCoin, PAP), réseaux sociaux et bouche-à-oreille. Visitez au minimum 10 biens avant de vous décider.</p>

<h2>Étape 4 : Faire une offre d'achat</h2>
<p>Une fois le bien trouvé, formulez une offre par écrit. Vous pouvez négocier le prix, surtout si le bien est sur le marché depuis longtemps ou nécessite des travaux.</p>

<h2>Étape 5 : La signature du compromis</h2>
<p>Le compromis de vente vous engage. Vous disposez de 10 jours pour vous rétracter. Pendant cette période, l'acheteur verse généralement 5 à 10 % du prix en séquestre.</p>

<h2>Étape 6 : L'obtention du prêt</h2>
<p>Vous avez 45 jours (mentionnés dans le compromis) pour obtenir votre financement. Faites jouer la concurrence entre les banques.</p>

<h2>Étape 7 : La signature de l'acte authentique</h2>
<p>Chez le notaire, vous signez l'acte définitif, versez le solde du prix et recevez les clés. C'est officiel, le bien vous appartient !</p>`,
  },
  {
    category: "Immobilier",
    catSlug: "immobilier",
    title: "Comprendre les charges de copropriété",
    slug: "charges-copropriete",
    imageUrl: "https://picsum.photos/seed/charges-copro/1200/630",
    metaDescription: "Charges récupérables, provisions, appels de fonds : tout comprendre sur les charges de copropriété pour éviter les mauvaises surprises.",
    content: `<h2>Qu'est-ce que les charges de copropriété ?</h2>
<p>Dans un immeuble en copropriété, les charges désignent les dépenses liées à l'entretien, à la gestion et au fonctionnement des parties communes. Elles sont réparties entre tous les copropriétaires selon leurs tantièmes.</p>

<h2>Les charges courantes</h2>
<p>Elles couvrent les dépenses régulières :</p>
<ul>
<li>Entretien des parties communes (nettoyage, éclairage)</li>
<li>Gardiennage ou accueil</li>
<li>Assurance de l'immeuble</li>
<li>Frais de syndic</li>
<li>Entretien des espaces verts</li>
</ul>

<h2>Les charges exceptionnelles</h2>
<p>Votées en assemblée générale, elles financent des travaux importants : ravalement de façade, réfection de toiture, mise aux normes ascenseur…</p>

<h2>Charges récupérables vs non récupérables</h2>
<p>En tant que bailleur, vous pouvez refacturer au locataire les charges dites "récupérables" (entretien courant, eau froide des parties communes, ordures ménagères…). Les autres restent à votre charge.</p>

<h2>Comment contester des charges abusives ?</h2>
<p>Si vous estimez que les charges sont excessives, commencez par demander les justificatifs au syndic. En cas de désaccord, vous pouvez faire appel au médiateur de la copropriété ou saisir le tribunal judiciaire.</p>`,
  },
  {
    category: "Immobilier",
    catSlug: "immobilier",
    title: "Investir dans l'immobilier locatif : guide complet",
    slug: "investir-immobilier-locatif",
    imageUrl: "https://picsum.photos/seed/immobilier-locatif/1200/630",
    metaDescription: "Stratégies, dispositifs fiscaux, types de biens : le guide complet pour réussir votre investissement immobilier locatif en France.",
    content: `<h2>Pourquoi investir dans l'immobilier locatif ?</h2>
<p>L'immobilier locatif présente plusieurs avantages majeurs : des revenus réguliers, une protection contre l'inflation, la constitution d'un patrimoine et des avantages fiscaux selon le dispositif choisi.</p>

<h2>Les différents types d'investissements</h2>
<ul>
<li><strong>La location nue (vide)</strong> : régime fiscal classique, moins de flexibilité mais locataires souvent plus stables</li>
<li><strong>La location meublée (LMNP)</strong> : régime fiscal avantageux avec amortissement du bien, revenus plus élevés</li>
<li><strong>La colocation</strong> : rentabilité maximisée, gestion plus complexe</li>
<li><strong>La location courte durée (Airbnb)</strong> : revenus importants mais très réglementée dans les grandes villes</li>
</ul>

<h2>Les dispositifs fiscaux à connaître</h2>
<p>La loi Pinel, même en phase d'extinction, offre encore des réductions d'impôts pour les investissements dans le neuf en zones tendues. Le statut LMNP reste l'un des plus avantageux pour réduire la fiscalité sur les revenus locatifs.</p>

<h2>Bien choisir son emplacement</h2>
<p>L'emplacement reste le critère n°1. Privilégiez les villes dynamiques avec une forte demande locative, une population étudiante, des bassins d'emploi en croissance et de bonnes infrastructures de transport.</p>

<h2>Gérer ou déléguer ?</h2>
<p>La gestion en direct maximise vos revenus mais demande du temps. La délégation à une agence (5 à 10 % des loyers) simplifie votre quotidien. Évaluez honnêtement le temps que vous pouvez y consacrer.</p>`,
  },
  {
    category: "Immobilier",
    catSlug: "immobilier",
    title: "Prêt immobilier à taux fixe : tout ce qu'il faut savoir",
    slug: "pret-immobilier-taux-fixe",
    imageUrl: "https://picsum.photos/seed/pret-taux-fixe/1200/630",
    metaDescription: "Fonctionnement, avantages et inconvénients du prêt immobilier à taux fixe. Comment négocier les meilleures conditions pour votre emprunt.",
    content: `<h2>Comment fonctionne un prêt à taux fixe ?</h2>
<p>Dans un crédit immobilier à taux fixe, le taux d'intérêt est déterminé à la signature du contrat et reste identique pendant toute la durée du prêt. Vos mensualités ne varient jamais, ce qui facilite grandement la gestion de votre budget.</p>

<h2>Les avantages</h2>
<ul>
<li>Sécurité et prévisibilité : vous connaissez le coût total de votre emprunt dès le départ</li>
<li>Protection contre la hausse des taux</li>
<li>Idéal pour les ménages ayant un budget contraint</li>
</ul>

<h2>Les inconvénients</h2>
<ul>
<li>Si les taux baissent, vous ne profitez pas de la baisse (sauf à renégocier)</li>
<li>Généralement légèrement plus élevé qu'un taux variable au moment de la souscription</li>
<li>Des indemnités de remboursement anticipé peuvent s'appliquer</li>
</ul>

<h2>Comment négocier son taux ?</h2>
<p>Faites jouer la concurrence entre plusieurs banques. Un courtier peut vous aider à obtenir les meilleures conditions. Votre apport personnel (idéalement 10 % minimum), la stabilité de vos revenus et votre historique bancaire sont les principaux leviers de négociation.</p>

<h2>Renégociation et rachat de crédit</h2>
<p>Si les taux du marché baissent significativement après votre souscription, envisagez une renégociation auprès de votre banque ou un rachat de crédit auprès d'un concurrent. La règle empirique : renégocier si la différence est d'au moins 0,7 point et si vous êtes dans la première moitié de votre emprunt.</p>`,
  },

  // ── FINANCE ─────────────────────────────────────────────────────
  {
    category: "Finance",
    catSlug: "finance",
    title: "Comment ouvrir un compte épargne en 2024",
    slug: "ouvrir-compte-epargne",
    imageUrl: "https://picsum.photos/seed/epargne-2024/1200/630",
    metaDescription: "Livret A, LDDS, PEL, LEP... Quel compte épargne choisir ? Notre guide complet pour placer votre argent intelligemment en 2024.",
    content: `<h2>Les différents types de comptes épargne</h2>
<p>En France, plusieurs produits d'épargne réglementés offrent des avantages fiscaux intéressants. Le choix dépend de vos objectifs et de votre situation.</p>

<h2>Le Livret A</h2>
<p>Le plus populaire des livrets d'épargne. Taux actuel : 3 %. Plafond : 22 950 €. Les intérêts sont exonérés d'impôt et de prélèvements sociaux. Disponible dans toutes les banques, gratuit et sans frais.</p>

<h2>Le Livret d'Épargne Populaire (LEP)</h2>
<p>Réservé aux personnes ayant des revenus modestes, le LEP offre le meilleur taux des livrets réglementés (actuellement 5 %). Plafond : 10 000 €. Si vous êtes éligible, c'est la priorité absolue.</p>

<h2>Le Plan Épargne Logement (PEL)</h2>
<p>Conçu pour financer un projet immobilier, le PEL offre un taux fixé à 2,25 % pour les nouveaux plans. Il est intéressant pour préparer un achat immobilier dans 4 à 10 ans.</p>

<h2>Le Livret de Développement Durable et Solidaire (LDDS)</h2>
<p>Similaire au Livret A (même taux à 3 %), avec un plafond de 12 000 €. À ouvrir une fois le Livret A plein.</p>

<h2>Comment procéder à l'ouverture ?</h2>
<p>L'ouverture se fait en ligne ou en agence, avec votre pièce d'identité et un RIB. Les banques en ligne offrent souvent des bonus de bienvenue. Attention : vous ne pouvez détenir qu'un seul Livret A, un seul LEP et un seul LDDS, quelle que soit votre banque.</p>`,
  },
  {
    category: "Finance",
    catSlug: "finance",
    title: "Les meilleures stratégies pour réduire ses impôts légalement",
    slug: "strategies-reduire-impots",
    imageUrl: "https://picsum.photos/seed/reduire-impots/1200/630",
    metaDescription: "Défiscalisation légale : PER, dons, emploi à domicile, investissements… Les meilleures stratégies pour optimiser votre fiscalité en toute légalité.",
    content: `<h2>Comprendre votre tranche marginale d'imposition</h2>
<p>Avant d'optimiser, vous devez connaître votre taux marginal d'imposition (TMI). Plus il est élevé, plus les niches fiscales vous bénéficient. En France, les tranches vont de 0 % à 45 %.</p>

<h2>Le Plan d'Épargne Retraite (PER)</h2>
<p>Les versements sur un PER sont déductibles de votre revenu imposable, dans la limite de 10 % de vos revenus professionnels. Un contribuable dans la tranche à 30 % qui verse 5 000 € économise 1 500 € d'impôts.</p>

<h2>Les dons aux associations</h2>
<p>Les dons à des associations reconnues d'utilité publique ouvrent droit à une réduction d'impôt de 66 % ou 75 % du montant donné (selon le type d'association). Un don de 100 € ne vous coûte réellement que 25 à 34 €.</p>

<h2>L'emploi à domicile</h2>
<p>Les dépenses pour employer une aide à domicile (ménage, garde d'enfants, jardinage, soutien scolaire) ouvrent droit à un crédit d'impôt de 50 %. Plafond : 12 000 € de dépenses annuelles.</p>

<h2>L'investissement en FCPI et FIP</h2>
<p>Ces fonds qui investissent dans des PME innovantes offrent une réduction d'impôt de 18 à 25 % du montant investi. Risqué mais fiscalement attractif pour les hauts revenus.</p>

<h2>À éviter : les montages abusifs</h2>
<p>L'optimisation fiscale est légale, l'évasion fiscale est un délit. Méfiez-vous des schémas "trop beaux pour être vrais" et faites appel à un expert-comptable ou un conseiller fiscal agréé.</p>`,
  },
  {
    category: "Finance",
    catSlug: "finance",
    title: "Comprendre la Bourse pour les débutants",
    slug: "comprendre-bourse-debutants",
    imageUrl: "https://picsum.photos/seed/bourse-debutants/1200/630",
    metaDescription: "Actions, obligations, ETF, dividendes : toutes les notions clés pour débuter en Bourse sereinement et éviter les erreurs classiques.",
    content: `<h2>Comment fonctionne la Bourse ?</h2>
<p>La Bourse est un marché où s'échangent des titres financiers : actions (parts d'entreprises), obligations (dettes d'États ou d'entreprises) et autres instruments. Les prix fluctuent en fonction de l'offre et de la demande, influencée par les résultats des entreprises, l'économie mondiale et la psychologie des investisseurs.</p>

<h2>Les principaux types d'actifs</h2>
<ul>
<li><strong>Actions</strong> : vous devenez propriétaire d'une fraction d'une entreprise. Potentiel de gain élevé, mais risque plus important.</li>
<li><strong>Obligations</strong> : vous prêtez de l'argent à une entreprise ou un État qui vous rémunère par des intérêts.</li>
<li><strong>ETF (trackers)</strong> : fonds qui répliquent un indice boursier (CAC 40, S&P 500). Simple, peu coûteux, diversifié.</li>
</ul>

<h2>Comment investir en Bourse ?</h2>
<p>Pour investir, vous avez besoin d'un compte-titres ordinaire (CTO) ou d'un Plan d'Épargne en Actions (PEA). Le PEA offre une fiscalité avantageuse après 5 ans de détention (flat tax à 17,2 % seulement sur les prélèvements sociaux).</p>

<h2>Les erreurs classiques du débutant</h2>
<ul>
<li>Investir de l'argent dont vous avez besoin à court terme</li>
<li>Mettre tous ses œufs dans le même panier (manque de diversification)</li>
<li>Acheter quand la Bourse monte, vendre quand elle baisse (comportement moutonnier)</li>
<li>Chercher à "timer" le marché</li>
</ul>

<h2>La stratégie des débutants : le DCA</h2>
<p>Le Dollar-Cost Averaging (investissement progressif) consiste à investir une somme fixe régulièrement, quel que soit le niveau du marché. Simple et efficace, cette stratégie permet de lisser le prix d'achat et de ne pas s'inquiéter des fluctuations quotidiennes.</p>`,
  },
  {
    category: "Finance",
    catSlug: "finance",
    title: "Assurance-vie : comment bien choisir son contrat",
    slug: "choisir-assurance-vie",
    imageUrl: "https://picsum.photos/seed/assurance-vie/1200/630",
    metaDescription: "Fonds euros, unités de compte, frais, fiscalité : tout ce que vous devez savoir pour choisir le meilleur contrat d'assurance-vie.",
    content: `<h2>Qu'est-ce que l'assurance-vie ?</h2>
<p>Contrairement à ce que son nom suggère, l'assurance-vie est avant tout un produit d'épargne et de transmission de patrimoine. C'est le placement préféré des Français, avec plus de 1 900 milliards d'euros d'encours.</p>

<h2>Fonds euros vs unités de compte</h2>
<p>Les contrats modernes proposent deux types de supports :</p>
<ul>
<li><strong>Fonds euros</strong> : capital garanti, rendement faible mais sécurisé (environ 2,5 % en 2023)</li>
<li><strong>Unités de compte (UC)</strong> : investis en actions, obligations, immobilier… Potentiel de rendement élevé, mais capital non garanti</li>
</ul>

<h2>Les frais à surveiller</h2>
<p>Les frais sont déterminants sur le long terme. Comparez :</p>
<ul>
<li>Frais d'entrée : 0 à 5 % (à négocier ou à éviter)</li>
<li>Frais de gestion annuels : 0,5 à 1 % sur le fonds euros, 0,6 à 1 % sur les UC</li>
<li>Frais d'arbitrage : gratuits ou payants selon les contrats</li>
</ul>

<h2>La fiscalité avantageuse</h2>
<p>Après 8 ans de détention, les gains bénéficient d'un abattement annuel de 4 600 € (9 200 € pour un couple) avant imposition. C'est l'enveloppe fiscale la plus avantageuse pour l'épargne à long terme.</p>

<h2>Transmission et clause bénéficiaire</h2>
<p>L'assurance-vie permet de transmettre jusqu'à 152 500 € par bénéficiaire hors succession, avec une fiscalité réduite. La rédaction de la clause bénéficiaire est cruciale : faites-vous accompagner par un notaire ou un conseiller en gestion de patrimoine.</p>`,
  },
  {
    category: "Finance",
    catSlug: "finance",
    title: "PEA vs compte-titres : lequel choisir pour investir ?",
    slug: "pea-vs-compte-titres",
    imageUrl: "https://picsum.photos/seed/pea-cto/1200/630",
    metaDescription: "PEA ou compte-titres ordinaire ? Découvrez les différences en termes de fiscalité, de flexibilité et de supports disponibles pour faire le bon choix.",
    content: `<h2>Le Plan d'Épargne en Actions (PEA)</h2>
<p>Le PEA permet d'investir en actions européennes avec une fiscalité très avantageuse. Après 5 ans, les plus-values et dividendes ne sont taxés qu'aux prélèvements sociaux (17,2 %), sans impôt sur le revenu.</p>
<p>Limites du PEA :</p>
<ul>
<li>Plafond de versement : 150 000 € (PEA classique) + 75 000 € (PEA-PME)</li>
<li>Investissement limité aux actions européennes (et certains ETF)</li>
<li>Tout retrait avant 5 ans ferme le plan</li>
</ul>

<h2>Le Compte-Titres Ordinaire (CTO)</h2>
<p>Le CTO n'a aucune limite de versement et donne accès à l'ensemble des marchés mondiaux (actions américaines, obligations, matières premières, ETF exotiques…). En revanche, les gains sont soumis à la flat tax de 30 % (12,8 % d'IR + 17,2 % de prélèvements sociaux).</p>

<h2>Tableau comparatif</h2>
<ul>
<li><strong>Fiscalité</strong> : PEA gagne (17,2 % après 5 ans vs 30 % CTO)</li>
<li><strong>Flexibilité</strong> : CTO gagne (retraits libres, marchés mondiaux)</li>
<li><strong>Plafond</strong> : CTO gagne (illimité)</li>
<li><strong>Supports disponibles</strong> : CTO gagne (toutes classes d'actifs)</li>
</ul>

<h2>La stratégie optimale</h2>
<p>Pour la plupart des investisseurs, la stratégie idéale est d'abord de maximiser le PEA (priorité fiscale), puis d'utiliser le CTO pour les investissements hors zone euro ou au-delà du plafond. L'assurance-vie complète l'ensemble pour la transmission.</p>`,
  },

  // ── DROIT ────────────────────────────────────────────────────────
  {
    category: "Droit",
    catSlug: "droit",
    title: "Vos droits en cas de licenciement abusif",
    slug: "droits-licenciement-abusif",
    imageUrl: "https://picsum.photos/seed/licenciement-abusif/1200/630",
    metaDescription: "Vous pensez avoir été licencié abusivement ? Découvrez vos droits, les recours possibles et les indemnités auxquelles vous pouvez prétendre.",
    content: `<h2>Qu'est-ce qu'un licenciement abusif ?</h2>
<p>Un licenciement est considéré comme abusif (ou "sans cause réelle et sérieuse") lorsque l'employeur ne peut pas justifier d'un motif valable, qu'il soit personnel (faute, insuffisance professionnelle) ou économique. Il peut également être irrégulier si la procédure n'a pas été respectée.</p>

<h2>Les signes d'un licenciement potentiellement abusif</h2>
<ul>
<li>Lettre de licenciement vague ou sans motif précis</li>
<li>Non-respect de la procédure (absence de convocation, délai non respecté)</li>
<li>Licenciement après un signalement (discrimination, harcèlement)</li>
<li>Licenciement d'une salariée enceinte (très protégée)</li>
<li>Rupture après une demande de congé maternité/paternité</li>
</ul>

<h2>Les démarches à suivre</h2>
<p>Agissez rapidement : vous disposez de 12 mois à compter de la notification du licenciement pour saisir le Conseil de Prud'hommes. Commencez par :</p>
<ol>
<li>Consulter un avocat spécialisé en droit du travail (première consultation souvent gratuite)</li>
<li>Réunir tous les documents : contrat de travail, lettres, e-mails, fiches de paie</li>
<li>Contacter votre syndicat si vous en êtes membre</li>
</ol>

<h2>Les indemnités en cas de victoire</h2>
<p>Le barème Macron fixe des indemnités minimales et maximales selon votre ancienneté. Par exemple, pour 5 ans d'ancienneté : minimum 3 mois de salaire, maximum 6 mois. Ces barèmes peuvent être écartés en cas de harcèlement ou de discrimination.</p>`,
  },
  {
    category: "Droit",
    catSlug: "droit",
    title: "Comment rédiger un testament valide",
    slug: "rediger-testament-valide",
    imageUrl: "https://picsum.photos/seed/testament/1200/630",
    metaDescription: "Testament olographe ou notarié ? Conditions de validité, héritiers réservataires, legs particuliers : tout sur la rédaction d'un testament en France.",
    content: `<h2>Pourquoi rédiger un testament ?</h2>
<p>Sans testament, votre patrimoine est réparti selon les règles légales de succession. Un testament vous permet d'organiser votre héritage, de protéger un proche non héritier légal (conjoint non marié, ami) ou d'avantager l'un de vos enfants dans les limites autorisées.</p>

<h2>Le testament olographe</h2>
<p>C'est le plus simple : il est écrit entièrement à la main, daté et signé par le testateur. Aucun témoin ni notaire n'est requis. Conditions de validité :</p>
<ul>
<li>Entièrement manuscrit (jamais tapé à l'ordinateur)</li>
<li>Daté avec précision (jour, mois, année)</li>
<li>Signé de votre nom</li>
</ul>

<h2>Le testament authentique (notarié)</h2>
<p>Dicté au notaire devant deux témoins ou deux notaires, ce testament est plus sécurisé. Il ne peut pas être perdu ou contesté facilement, et est enregistré au Fichier Central des Dispositions de Dernières Volontés (FCDDV).</p>

<h2>La réserve héréditaire : la limite à respecter</h2>
<p>Vous ne pouvez pas déshériter totalement vos enfants. La loi leur garantit une "réserve héréditaire" : 1/2 du patrimoine pour un enfant, 2/3 pour deux enfants, 3/4 pour trois enfants ou plus. Le reste (la "quotité disponible") peut être légué librement.</p>

<h2>Où conserver son testament ?</h2>
<p>Remettez-le à un notaire pour enregistrement ou gardez-le en lieu sûr et informez une personne de confiance de son existence. Un testament non trouvé est un testament inutile.</p>`,
  },
  {
    category: "Droit",
    catSlug: "droit",
    title: "Le bail d'habitation : tout ce qu'il faut savoir",
    slug: "bail-habitation-guide",
    imageUrl: "https://picsum.photos/seed/bail-habitation/1200/630",
    metaDescription: "Durée, dépôt de garantie, préavis, état des lieux : le guide complet sur le contrat de bail d'habitation pour locataires et propriétaires.",
    content: `<h2>Les différents types de baux</h2>
<p>En France, le bail d'habitation est principalement régi par la loi du 6 juillet 1989. Il existe plusieurs types :</p>
<ul>
<li><strong>Bail nu (vide)</strong> : durée minimale de 3 ans (bailleur particulier) ou 6 ans (bailleur personne morale)</li>
<li><strong>Bail meublé</strong> : durée d'un an renouvelable (9 mois pour les étudiants)</li>
<li><strong>Bail mobilité</strong> : 1 à 10 mois, non renouvelable, réservé à des personnes en situation de mobilité professionnelle</li>
</ul>

<h2>Le dépôt de garantie</h2>
<p>Limité à 1 mois de loyer hors charges pour un logement vide, 2 mois pour un meublé. Il doit être restitué dans les 2 mois suivant l'état des lieux de sortie (1 mois si l'état des lieux de sortie est identique à celui d'entrée).</p>

<h2>L'état des lieux : une étape cruciale</h2>
<p>Réalisé contradictoirement à l'entrée et à la sortie, l'état des lieux documente l'état du logement. Soyez précis et photographiez tout. Tout défaut non mentionné à l'entrée peut être imputé au locataire à la sortie.</p>

<h2>Le préavis de départ</h2>
<p>Pour un logement vide, le locataire doit donner 3 mois de préavis (réduit à 1 mois dans les zones tendues ou en cas de perte d'emploi, mutation…). Pour un meublé, le préavis est d'1 mois quelle que soit la zone.</p>

<h2>Les obligations de chaque partie</h2>
<p>Le bailleur doit fournir un logement décent, effectuer les réparations importantes et garantir la jouissance paisible. Le locataire doit payer son loyer, entretenir le logement et réaliser les "menues réparations locatives".</p>`,
  },
  {
    category: "Droit",
    catSlug: "droit",
    title: "Recours contre une décision administrative",
    slug: "recours-decision-administrative",
    imageUrl: "https://picsum.photos/seed/recours-admin/1200/630",
    metaDescription: "Refus de permis de construire, amende contestée, décision préfectorale : comment exercer un recours contre une décision administrative en France.",
    content: `<h2>Deux types de recours : gracieux et contentieux</h2>
<p>Lorsqu'une décision administrative vous semble injuste, vous pouvez d'abord exercer un recours gracieux (auprès de l'autorité qui a pris la décision) ou hiérarchique (auprès du supérieur). Ces recours amiables sont gratuits et suspendent le délai pour saisir le tribunal.</p>

<h2>Le recours contentieux devant le tribunal administratif</h2>
<p>Si le recours amiable échoue ou reste sans réponse pendant 2 mois, vous pouvez saisir le tribunal administratif. Le délai général est de 2 mois à compter de la notification de la décision ou du silence de l'administration.</p>

<h2>Les décisions les plus fréquemment contestées</h2>
<ul>
<li>Refus de permis de construire</li>
<li>Sanctions disciplinaires dans la fonction publique</li>
<li>Décisions de l'URSSAF ou des caisses de retraite</li>
<li>Refus de visa ou de titre de séjour</li>
<li>Amendes et contraventions administratives</li>
</ul>

<h2>La procédure devant le tribunal administratif</h2>
<p>La procédure est écrite et contradictoire. Vous déposez une requête exposant vos arguments, l'administration répond, vous pouvez répliquer. Le tribunal rend ensuite son jugement, souvent après plusieurs mois.</p>

<h2>Le Défenseur des droits</h2>
<p>Avant de vous lancer dans une procédure judiciaire, pensez au Défenseur des droits. Cette autorité indépendante peut intervenir gratuitement pour vous aider à faire valoir vos droits face à l'administration.</p>`,
  },

  // ── SANTÉ ────────────────────────────────────────────────────────
  {
    category: "Santé",
    catSlug: "sante",
    title: "Les bienfaits de la méditation quotidienne",
    slug: "bienfaits-meditation-quotidienne",
    imageUrl: "https://picsum.photos/seed/meditation/1200/630",
    metaDescription: "Réduction du stress, amélioration du sommeil, meilleure concentration : découvrez les bienfaits scientifiquement prouvés de la méditation quotidienne.",
    content: `<h2>Qu'est-ce que la méditation ?</h2>
<p>La méditation est une pratique mentale qui consiste à porter intentionnellement son attention sur le moment présent, sans jugement. Elle existe depuis des millénaires dans de nombreuses traditions spirituelles, mais c'est aujourd'hui une pratique laïque largement étudiée par la science.</p>

<h2>Les bienfaits scientifiquement prouvés</h2>
<ul>
<li><strong>Réduction du stress</strong> : la méditation diminue le cortisol, l'hormone du stress</li>
<li><strong>Amélioration du sommeil</strong> : la pratique régulière aide à s'endormir plus facilement</li>
<li><strong>Meilleure gestion des émotions</strong> : elle augmente l'activité du cortex préfrontal, lié à la régulation émotionnelle</li>
<li><strong>Réduction de l'anxiété et de la dépression</strong> : des méta-analyses montrent un effet comparable aux antidépresseurs légers</li>
<li><strong>Amélioration de la concentration</strong> : même 10 minutes par jour modifient la structure du cerveau (neuroplasticité)</li>
</ul>

<h2>Comment commencer ?</h2>
<p>Pas besoin d'équipement spécifique. Commencez par 5 minutes par jour, assis confortablement, en vous concentrant sur votre respiration. Des applications comme Petit Bambou, Calm ou Headspace (en français) peuvent vous guider.</p>

<h2>Les différents types de méditation</h2>
<ul>
<li><strong>Pleine conscience (MBSR)</strong> : observation neutre du moment présent</li>
<li><strong>Méditation transcendantale</strong> : répétition d'un mantra</li>
<li><strong>Body scan</strong> : balayage corporel pour relâcher les tensions</li>
<li><strong>Méditation de bienveillance (Metta)</strong> : cultivation de la compassion</li>
</ul>

<h2>La régularité avant tout</h2>
<p>10 minutes tous les jours valent mieux qu'une heure une fois par semaine. Associez la méditation à un rituel existant (après le café du matin, avant de dormir) pour ancrer l'habitude.</p>`,
  },
  {
    category: "Santé",
    catSlug: "sante",
    title: "Alimentation anti-inflammatoire : guide pratique",
    slug: "alimentation-anti-inflammatoire",
    imageUrl: "https://picsum.photos/seed/anti-inflammatoire/1200/630",
    metaDescription: "L'inflammation chronique est liée à de nombreuses maladies. Découvrez les aliments à privilégier et à éviter pour adopter une alimentation anti-inflammatoire.",
    content: `<h2>Qu'est-ce que l'inflammation chronique ?</h2>
<p>L'inflammation est une réponse naturelle du système immunitaire face aux agressions. Lorsqu'elle devient chronique et silencieuse, elle est associée à des maladies cardiovasculaires, le diabète de type 2, l'arthrite et certains cancers. L'alimentation joue un rôle majeur dans sa régulation.</p>

<h2>Les aliments pro-inflammatoires à limiter</h2>
<ul>
<li>Sucres raffinés et sodas sucrés</li>
<li>Huiles végétales riches en oméga-6 (tournesol, maïs, soja)</li>
<li>Aliments ultra-transformés (plats préparés, charcuteries industrielles)</li>
<li>Alcool en excès</li>
<li>Viande rouge en grande quantité</li>
</ul>

<h2>Les aliments anti-inflammatoires à privilégier</h2>
<ul>
<li><strong>Poissons gras</strong> (saumon, maquereau, sardines) : riches en oméga-3</li>
<li><strong>Légumes colorés</strong> : brocoli, épinards, poivrons, betteraves</li>
<li><strong>Fruits rouges</strong> : myrtilles, framboises, cerises (riches en antioxydants)</li>
<li><strong>Huile d'olive extra vierge</strong> : source d'oléocanthal, puissant anti-inflammatoire</li>
<li><strong>Épices</strong> : curcuma (avec poivre noir pour l'absorption), gingembre, cannelle</li>
<li><strong>Noix et amandes</strong> : acides gras essentiels et vitamine E</li>
</ul>

<h2>Le régime méditerranéen : le modèle de référence</h2>
<p>Classé meilleur régime alimentaire au monde plusieurs années de suite, le régime méditerranéen est naturellement anti-inflammatoire : beaucoup de légumes et fruits, huile d'olive, poissons, légumineuses, peu de viande rouge et de produits transformés.</p>

<h2>Par où commencer ?</h2>
<p>Commencez par remplacer vos huiles de cuisson par de l'huile d'olive, ajoutez du curcuma à vos plats, mangez du poisson deux fois par semaine et snackez avec des noix plutôt que des chips. Les petits changements cumulés font la différence.</p>`,
  },
  {
    category: "Santé",
    catSlug: "sante",
    title: "Comment améliorer son sommeil naturellement",
    slug: "ameliorer-sommeil-naturellement",
    imageUrl: "https://picsum.photos/seed/sommeil-naturel/1200/630",
    metaDescription: "Insomnie, réveils nocturnes, fatigue chronique : nos conseils basés sur la science pour retrouver un sommeil réparateur sans médicament.",
    content: `<h2>Pourquoi le sommeil est-il essentiel ?</h2>
<p>Le sommeil est bien plus qu'un repos passif. C'est pendant la nuit que le cerveau consolide les apprentissages, que le corps se répare, que le système immunitaire se renforce et que les hormones se régulent. Un manque chronique de sommeil est associé à l'obésité, aux maladies cardiovasculaires et à la dépression.</p>

<h2>Respecter votre rythme circadien</h2>
<p>Votre horloge biologique régule naturellement vos cycles de sommeil et d'éveil. Levez-vous et couchez-vous à heures fixes, même le week-end. L'exposition à la lumière naturelle le matin renforce ce rythme.</p>

<h2>L'hygiène du sommeil : les règles d'or</h2>
<ul>
<li><strong>Évitez les écrans 1h avant le coucher</strong> : la lumière bleue inhibe la mélatonine</li>
<li><strong>Gardez votre chambre fraîche</strong> : la température idéale se situe entre 16 et 19°C</li>
<li><strong>Associez le lit au sommeil</strong> : n'y travaillez pas et ne regardez pas de séries au lit</li>
<li><strong>Limitez la caféine après 14h</strong> : sa demi-vie est de 5 à 7 heures</li>
<li><strong>Évitez l'alcool</strong> : il facilite l'endormissement mais fragmente le sommeil profond</li>
</ul>

<h2>Techniques naturelles pour favoriser le sommeil</h2>
<ul>
<li><strong>Cohérence cardiaque</strong> : 5 minutes de respiration rythmée (5 sec inspir, 5 sec expir)</li>
<li><strong>Bain chaud ou douche chaude</strong> 1h avant de dormir provoque une baisse de température corporelle propice au sommeil</li>
<li><strong>Mélatonine</strong> : à faible dose (0,5 mg), utile pour le décalage horaire ou les travailleurs de nuit</li>
<li><strong>Valériane, passiflore</strong> : plantes aux propriétés légèrement sédatives</li>
</ul>

<h2>Quand consulter un médecin ?</h2>
<p>Si les troubles du sommeil persistent plus de 3 mois et altèrent votre qualité de vie, consultez un médecin. Des thérapies cognitivo-comportementales pour l'insomnie (TCC-I) sont plus efficaces à long terme que les somnifères.</p>`,
  },
  {
    category: "Santé",
    catSlug: "sante",
    title: "Prévenir les maladies cardiovasculaires",
    slug: "prevenir-maladies-cardiovasculaires",
    imageUrl: "https://picsum.photos/seed/cardio-prevention/1200/630",
    metaDescription: "Première cause de mortalité mondiale, les maladies cardiovasculaires sont largement évitables. Nos conseils pour protéger votre cœur au quotidien.",
    content: `<h2>Les maladies cardiovasculaires en chiffres</h2>
<p>En France, les maladies cardiovasculaires (infarctus, AVC, insuffisance cardiaque) sont responsables de 140 000 décès par an. Pourtant, 80 % de ces maladies pourraient être évitées par des changements de mode de vie.</p>

<h2>Les principaux facteurs de risque</h2>
<ul>
<li>Hypertension artérielle (souvent asymptomatique)</li>
<li>Taux de cholestérol élevé (LDL)</li>
<li>Tabagisme</li>
<li>Diabète de type 2</li>
<li>Sédentarité et obésité abdominale</li>
<li>Stress chronique</li>
</ul>

<h2>L'activité physique : le médicament universel</h2>
<p>L'OMS recommande 150 minutes d'activité modérée ou 75 minutes d'activité intense par semaine. La marche rapide, le vélo, la natation ou la danse font l'affaire. L'exercice réduit la pression artérielle, améliore le cholestérol et diminue l'inflammation.</p>

<h2>L'alimentation cardioprotectrice</h2>
<p>Adoptez le régime méditerranéen : huile d'olive, poissons gras, légumes, fruits, légumineuses. Réduisez le sel (hypertension), les graisses saturées (charcuterie, fromages gras) et les aliments ultra-transformés.</p>

<h2>Arrêter de fumer : la décision la plus impactante</h2>
<p>Le tabac double le risque d'infarctus. Dès l'arrêt, le risque commence à diminuer : après 1 an sans tabac, le risque cardiovasculaire est réduit de moitié. Des traitements efficaces existent (substituts nicotiniques, varénicline).</p>

<h2>Le suivi médical régulier</h2>
<p>Faites mesurer votre tension artérielle au moins une fois par an. Contrôlez votre bilan lipidique tous les 5 ans (ou plus souvent si des facteurs de risque sont présents). L'électrocardiogramme est recommandé à partir de 40 ans.</p>`,
  },

  // ── EMPLOI ───────────────────────────────────────────────────────
  {
    category: "Emploi",
    catSlug: "emploi",
    title: "Rédiger un CV qui se démarque en 2024",
    slug: "rediger-cv-remarquable",
    imageUrl: "https://picsum.photos/seed/cv-2024/1200/630",
    metaDescription: "Structure, mise en page, mots-clés ATS, soft skills : tous nos conseils pour créer un CV moderne et efficace qui décroche des entretiens.",
    content: `<h2>Le CV en 2024 : ce qui a changé</h2>
<p>Les recruteurs passent en moyenne 7 secondes sur un CV. De plus, la majorité des grandes entreprises utilisent des logiciels ATS (Applicant Tracking System) qui filtrent les CV avant même qu'un humain les lise. Votre CV doit d'abord passer la machine, puis convaincre le recruteur.</p>

<h2>La structure gagnante</h2>
<ol>
<li><strong>En-tête</strong> : Nom, titre du poste visé, coordonnées, LinkedIn, portfolio si pertinent</li>
<li><strong>Accroche</strong> : 2-3 lignes résumant votre valeur ajoutée (optionnel mais efficace)</li>
<li><strong>Expériences</strong> : ordre anti-chronologique, résultats chiffrés impératifs</li>
<li><strong>Formation</strong> : diplômes, certifications, formations continues</li>
<li><strong>Compétences</strong> : techniques (hard skills) et comportementales (soft skills)</li>
</ol>

<h2>Les résultats chiffrés : la clé de l'impact</h2>
<p>Ne dites pas "Responsable des ventes", mais "Augmenté le CA de 23 % en 18 mois (de 450 k€ à 556 k€)". Chaque expérience doit répondre à : "Qu'ai-je accompli et quel a été l'impact ?"</p>

<h2>Optimiser pour les ATS</h2>
<ul>
<li>Utilisez les mots-clés de l'offre d'emploi (compétences, logiciels, certifications)</li>
<li>Format simple : pas de tableaux, colonnes multiples, ou images</li>
<li>Titre de section standards : "Expériences", "Formation", "Compétences"</li>
<li>Police lisible : Arial, Calibri, Helvetica</li>
</ul>

<h2>Les erreurs à bannir</h2>
<ul>
<li>Photo (en France c'est toléré mais pas toujours utile)</li>
<li>Plus d'une page si vous avez moins de 10 ans d'expérience</li>
<li>Fautes d'orthographe (utilisez Antidote ou un correcteur)</li>
<li>Adresse e-mail peu professionnelle</li>
<li>Objectifs vagues ("Je souhaite évoluer dans un environnement dynamique")</li>
</ul>`,
  },
  {
    category: "Emploi",
    catSlug: "emploi",
    title: "Comment négocier son salaire avec succès",
    slug: "negocier-salaire",
    imageUrl: "https://picsum.photos/seed/negocier-salaire/1200/630",
    metaDescription: "Techniques, timing, arguments clés : maîtrisez l'art de la négociation salariale pour obtenir la rémunération que vous méritez.",
    content: `<h2>Pourquoi négocier est essentiel</h2>
<p>Moins de 40 % des candidats négocient leur salaire. Pourtant, ne pas négocier peut coûter des dizaines de milliers d'euros sur une carrière. Un employeur qui fait une offre s'attend généralement à une contre-proposition.</p>

<h2>Se préparer : connaître sa valeur marché</h2>
<p>Avant de négocier, renseignez-vous sur les salaires pratiqués pour votre poste :</p>
<ul>
<li>Glassdoor, LinkedIn Salary, Welcome to the Jungle (données salariales)</li>
<li>Réseaux professionnels et associations de votre secteur</li>
<li>Cabinets de recrutement (ils communiquent volontiers les fourchettes)</li>
</ul>

<h2>Le bon moment pour négocier</h2>
<p>Ne parlez de salaire qu'après avoir reçu une offre. Avant ça, vous êtes en position de faiblesse. Si le recruteur vous demande vos prétentions en entretien, retournez la question : "Quelle est la fourchette prévue pour ce poste ?"</p>

<h2>Les techniques efficaces</h2>
<ul>
<li><strong>Ancrer haut</strong> : commencez par un chiffre légèrement au-dessus de votre objectif pour laisser de la marge</li>
<li><strong>Justifier par la valeur</strong> : argumentez avec vos réalisations, pas vos besoins personnels</li>
<li><strong>Le silence</strong> : après avoir annoncé votre chiffre, taisez-vous. L'inconfort du silence pousse souvent l'autre à combler le vide</li>
<li><strong>Package global</strong> : si le salaire fixe est bloqué, négociez les variables, RTT, télétravail, formation, voiture de fonction</li>
</ul>

<h2>Gérer les refus</h2>
<p>En cas de refus, demandez : "Quelles seraient les conditions pour atteindre ce niveau ?" Cela transforme un non en plan d'action. Proposez un point de suivi dans 6 mois si la réponse est positive mais différée.</p>`,
  },
  {
    category: "Emploi",
    catSlug: "emploi",
    title: "Télétravail : avantages, inconvénients et bonnes pratiques",
    slug: "avantages-inconvenients-teletravail",
    imageUrl: "https://picsum.photos/seed/teletravail/1200/630",
    metaDescription: "Le télétravail a transformé le monde du travail. Découvrez comment en tirer le meilleur parti tout en évitant les pièges classiques.",
    content: `<h2>L'essor du télétravail post-Covid</h2>
<p>La pandémie de 2020 a contraint des millions de salariés à expérimenter le télétravail. Trois ans plus tard, une nouvelle organisation hybride s'est imposée dans de nombreuses entreprises : 2 à 3 jours en présentiel, le reste à distance.</p>

<h2>Les avantages du télétravail</h2>
<ul>
<li><strong>Gain de temps</strong> : suppression des trajets (en moyenne 45 min aller, soit 7 heures par semaine)</li>
<li><strong>Productivité</strong> : moins d'interruptions, plus de concentration pour les tâches complexes</li>
<li><strong>Qualité de vie</strong> : meilleur équilibre vie pro/vie perso, moins de stress lié aux transports</li>
<li><strong>Économies</strong> : moins de frais de transport, de restauration, de vêtements professionnels</li>
</ul>

<h2>Les inconvénients à ne pas négliger</h2>
<ul>
<li><strong>Isolement social</strong> : perte du lien avec les collègues, sentiment de déconnexion de l'équipe</li>
<li><strong>Frontière vie pro/perso</strong> : risque de travail en dehors des heures, de sur-connexion</li>
<li><strong>Évolution de carrière</strong> : les télétravailleurs peuvent être moins visibles pour les promotions</li>
<li><strong>Conditions matérielles</strong> : tout le monde n'a pas un espace de travail adapté</li>
</ul>

<h2>Les bonnes pratiques pour bien télétravailler</h2>
<ul>
<li>Définir des horaires fixes et les respecter</li>
<li>Aménager un espace de travail dédié, même minimal</li>
<li>Commencer la journée par une routine claire (café, liste de tâches)</li>
<li>Maintenir le contact social : appels vidéo, messages, déjeuners collectifs réguliers</li>
<li>"Débrancher" symboliquement en fin de journée (fermer l'ordinateur, sortir marcher)</li>
</ul>`,
  },
  {
    category: "Emploi",
    catSlug: "emploi",
    title: "Se reconvertir professionnellement après 40 ans",
    slug: "reconversion-professionnelle-40-ans",
    imageUrl: "https://picsum.photos/seed/reconversion-40/1200/630",
    metaDescription: "La reconversion à 40 ans est possible et plus courante qu'on ne le croit. Bilan de compétences, CPF, formations : notre guide complet pour réussir.",
    content: `<h2>La reconversion à 40 ans : mythe ou réalité ?</h2>
<p>Selon une étude de l'Apec, plus de 30 % des cadres envisagent une reconversion après 40 ans. L'âge n'est pas un obstacle : vous avez l'avantage de l'expérience, d'un réseau professionnel et d'une meilleure connaissance de vous-même.</p>

<h2>Étape 1 : Le bilan de compétences</h2>
<p>Financé par votre CPF (Compte Personnel de Formation), le bilan de compétences vous aide à identifier vos compétences transférables, vos motivations et votre projet professionnel. Il dure 24 heures maximum, réparties sur plusieurs semaines.</p>

<h2>Identifier votre projet</h2>
<p>Posez-vous les bonnes questions :</p>
<ul>
<li>Qu'est-ce qui me passionne au point de le faire sans être payé ?</li>
<li>Quelles compétences mes proches reconnaissent-ils en moi ?</li>
<li>Quelles sont mes contraintes (familiales, financières, géographiques) ?</li>
<li>Quel niveau de risque suis-je prêt à accepter ?</li>
</ul>

<h2>Les dispositifs de financement</h2>
<ul>
<li><strong>CPF</strong> : financement des formations certifiantes</li>
<li><strong>CPF de transition professionnelle</strong> : pour les salariés qui souhaitent changer de métier</li>
<li><strong>Pro-A</strong> : reconversion en alternance pour les salariés</li>
<li><strong>Démission-reconversion</strong> : démissionner et accéder aux allocations chômage sous conditions</li>
</ul>

<h2>Les secteurs qui recrutent</h2>
<p>Santé et social (aide à domicile, soins infirmiers), numérique (développement web, cybersécurité, data), transition écologique (rénovation énergétique, énergies renouvelables), et artisanat (menuiserie, plomberie, électricité) offrent de bonnes perspectives.</p>`,
  },

  // ── VOYAGE ───────────────────────────────────────────────────────
  {
    category: "Voyage",
    catSlug: "voyage",
    title: "Les 10 destinations incontournables en Europe",
    slug: "destinations-incontournables-europe",
    imageUrl: "https://picsum.photos/seed/europe-destinations/1200/630",
    metaDescription: "De Lisbonne à Prague, en passant par la Croatie et l'Islande : notre sélection des 10 destinations européennes à ne pas manquer.",
    content: `<h2>L'Europe, un continent aux mille visages</h2>
<p>L'Europe offre une diversité extraordinaire sur un territoire relativement compact : villes millénaires, paysages sauvages, gastronomies incomparables et diversité culturelle. Voici notre sélection des destinations à mettre absolument sur votre liste.</p>

<h2>1. Lisbonne, Portugal</h2>
<p>La capitale portugaise séduit par ses ruelles pavées, ses tramways jaunes, son fado mélancolique et ses pastéis de nata. Accessible, belle et moins chère que les autres capitales européennes.</p>

<h2>2. Dubrovnik, Croatie</h2>
<p>La "perle de l'Adriatique" avec ses remparts médiévaux, ses eaux turquoise et ses îles alentour. Évitez juillet-août pour fuir la foule.</p>

<h2>3. Reykjavik, Islande</h2>
<p>Porte d'entrée vers des paysages lunaires, les aurores boréales (octobre-mars), les geysers et les cascades spectaculaires. Une nature intacte et préservée.</p>

<h2>4. Prague, Tchéquie</h2>
<p>L'une des villes médiévales les mieux préservées d'Europe. Son château, son pont Charles, ses brasseries et ses prix abordables en font une destination idéale.</p>

<h2>5. Séville, Espagne</h2>
<p>La capitale andalouse explose de couleurs, de flamenco, de tapas et de monuments mauresques. Le printemps y est paradisiaque avec ses orangers en fleurs.</p>

<h2>6-10 : À ne pas manquer</h2>
<ul>
<li><strong>Édimbourg (Écosse)</strong> : son château surplombant la ville et ses highlands mystérieux</li>
<li><strong>Amsterdam (Pays-Bas)</strong> : canaux, musées d'exception et culture ouverte</li>
<li><strong>Bruges (Belgique)</strong> : la Venise du Nord, hors du temps</li>
<li><strong>Ljubljana (Slovénie)</strong> : la pépite méconnue au cœur des Alpes</li>
<li><strong>Thessalonique (Grèce)</strong> : gastronomie, histoire byzantine et vie nocturne</li>
</ul>`,
  },
  {
    category: "Voyage",
    catSlug: "voyage",
    title: "Voyager pas cher : toutes nos astuces",
    slug: "voyager-pas-cher-astuces",
    imageUrl: "https://picsum.photos/seed/voyage-budget/1200/630",
    metaDescription: "Vols, hôtels, nourriture, activités : nos meilleures astuces pour voyager pas cher sans sacrifier la qualité de votre expérience.",
    content: `<h2>Le mythe du voyage pas cher</h2>
<p>Voyager petit budget ne signifie pas se priver. Cela demande de l'anticipation, de la flexibilité et les bons outils. Voici les stratégies utilisées par les voyageurs expérimentés.</p>

<h2>Trouver les billets d'avion pas chers</h2>
<ul>
<li><strong>Flexibilité sur les dates</strong> : le mardi et le mercredi sont souvent les jours les moins chers pour voler</li>
<li><strong>Google Flights</strong> : utilisez l'outil "explorer" pour trouver les destinations les moins chères depuis votre aéroport</li>
<li><strong>Alertes de prix</strong> : configurez des alertes Skyscanner ou Kayak pour votre trajet</li>
<li><strong>Vols avec escale</strong> : parfois deux à trois fois moins chers que les vols directs</li>
<li><strong>Aéroports secondaires</strong> : Beauvais, Charleroi, Bergame plutôt que Paris, Bruxelles, Milan</li>
</ul>

<h2>Hébergement économique de qualité</h2>
<ul>
<li><strong>Airbnb hors centre</strong> : 30-40 % moins cher qu'en centre-ville</li>
<li><strong>Auberges de jeunesse modernes</strong> : certaines rivalisent avec les hôtels 3 étoiles</li>
<li><strong>Booking.com</strong> : activez le programme Genius pour des réductions immédiates</li>
<li><strong>Couchsurfing</strong> : gratuit et l'expérience humaine la plus enrichissante</li>
</ul>

<h2>Manger bien et pas cher</h2>
<p>Évitez les restaurants près des monuments touristiques (prix doublés, qualité divisée). Cherchez où mangent les locaux, fréquentez les marchés alimentaires et cuisinez si vous avez accès à une cuisine. Le petit-déjeuner à la boulangerie ou au supermarché économise des dizaines d'euros par jour.</p>

<h2>Activités gratuites ou peu coûteuses</h2>
<p>Presque toutes les grandes villes proposent des free tours (vous payez ce que vous voulez), des musées gratuits certains jours, des parcs magnifiques et des marchés animés. Cherchez "free things to do in [city]" avant de partir.</p>`,
  },
  {
    category: "Voyage",
    catSlug: "voyage",
    title: "Guide complet pour visiter le Japon",
    slug: "guide-visiter-japon",
    imageUrl: "https://picsum.photos/seed/japon-guide/1200/630",
    metaDescription: "Visa, budget, JR Pass, temples, gastronomie : tout ce qu'il faut savoir pour préparer et réussir votre premier voyage au Japon.",
    content: `<h2>Pourquoi le Japon fascine autant ?</h2>
<p>Le Japon est une destination qui déconcerte et éblouit à la fois : ultra-moderne et profondément traditionnelle, efficace et poétique, dense et tranquille. C'est régulièrement élu pays le plus accueillant pour les touristes étrangers.</p>

<h2>Formalités et budget</h2>
<p>Les citoyens français peuvent entrer au Japon sans visa pour un séjour touristique de moins de 90 jours. Prévoyez un budget de 100 à 200 € par jour selon votre style de voyage (hébergement : 40-100 €, repas : 20-40 €, transport : 10-30 €).</p>

<h2>Le JR Pass : indispensable ou pas ?</h2>
<p>Le Japan Rail Pass donne accès illimité aux trains JR (dont le Shinkansen). Rentable si vous visitez plusieurs villes (Tokyo-Kyoto-Osaka-Hiroshima). Calculez votre trajet sur Google Maps avant d'acheter : il faut environ 50 000 ¥ de trajets pour rentabiliser le pass de 7 jours.</p>

<h2>Itinéraire recommandé pour 2 semaines</h2>
<ul>
<li><strong>Tokyo</strong> (4-5 jours) : Shinjuku, Shibuya, Asakusa, Akihabara, Harajuku</li>
<li><strong>Nikko ou Hakone</strong> (1-2 jours) : nature et patrimoine UNESCO</li>
<li><strong>Kyoto</strong> (3-4 jours) : Fushimi Inari, Kinkakuji, Arashiyama, geishas à Gion</li>
<li><strong>Nara</strong> (1 jour) : cerfs en liberté et grand Bouddha</li>
<li><strong>Osaka</strong> (2 jours) : gastronomie de rue, château, vie nocturne</li>
</ul>

<h2>Les incontournables gastronomiques</h2>
<p>Ramen authentique dans un petit resto local, sushi au marché Tsukiji ou Toyosu, takoyaki et okonomiyaki à Osaka, kaiseki (gastronomie raffinée) à Kyoto, matcha sous toutes ses formes. Le Japon est paradisiaque pour les amoureux de cuisine.</p>

<h2>Conseils pratiques</h2>
<ul>
<li>Louez un pocket WiFi à l'aéroport (indispensable pour les maps et traductions)</li>
<li>Apprenez quelques mots japonais : les locaux l'apprécient infiniment</li>
<li>Apportez du cash : de nombreux établissements n'acceptent pas les cartes</li>
<li>Le printemps (cerisiers) et l'automne (érables) sont les meilleures saisons</li>
</ul>`,
  },
  // ── HIGH-TECH ────────────────────────────────────────────────────
  {
    category: "High-Tech",
    catSlug: "high-tech",
    title: "Intelligence artificielle : où en sommes-nous en 2024 ?",
    slug: "intelligence-artificielle-2024",
    imageUrl: "https://picsum.photos/seed/ia-2024/1200/630",
    metaDescription: "LLM, IA générative, agents autonomes, régulation : le point sur l'état de l'intelligence artificielle en 2024 et les enjeux qui se profilent.",
    content: `<h2>L'année de la démocratisation de l'IA</h2>
<p>2024 marque une accélération sans précédent de l'IA dans le quotidien. ChatGPT, Claude, Gemini et leurs déclinaisons ont transformé la façon dont nous travaillons, créons et cherchons de l'information. Mais où en sommes-nous vraiment ?</p>

<h2>Les grands modèles de langage (LLM)</h2>
<p>GPT-4o, Claude 3.5, Gemini Ultra : la course aux modèles s'est accélérée. Ces systèmes sont désormais capables de comprendre et générer du texte, des images, du code et même des vidéos avec une qualité bluffante. Mais ils restent fondamentalement des "autocompleteurs statistiques" et hallucinent encore régulièrement.</p>

<h2>L'IA générative dans les entreprises</h2>
<ul>
<li>Rédaction de contenu, résumés, traductions</li>
<li>Génération de code (GitHub Copilot, Cursor)</li>
<li>Service client automatisé</li>
<li>Analyse de documents juridiques et financiers</li>
</ul>

<h2>Les risques et enjeux éthiques</h2>
<p>La désinformation, les deepfakes, les biais algorithmiques et le remplacement d'emplois sont des préoccupations légitimes. L'Union Européenne a adopté l'AI Act, premier cadre réglementaire mondial sur l'IA, qui entrera progressivement en vigueur jusqu'en 2026.</p>

<h2>Perspectives 2025</h2>
<p>Les "agents IA" (systèmes capables d'agir de manière autonome pour accomplir des tâches complexes) seront la prochaine grande rupture. Ils pourraient transformer radicalement le travail de bureau tel que nous le connaissons.</p>`,
  },
  {
    category: "High-Tech",
    catSlug: "high-tech",
    title: "Les meilleurs smartphones de 2024 : comparatif complet",
    slug: "meilleurs-smartphones-2024",
    imageUrl: "https://picsum.photos/seed/smartphones-2024/1200/630",
    metaDescription: "iPhone 16, Samsung Galaxy S24, Google Pixel 9, Xiaomi 14 : notre comparatif des meilleurs smartphones de l'année pour faire le bon choix.",
    content: `<h2>Le marché du smartphone en 2024</h2>
<p>Après des années d'innovations marginales, 2024 marque le retour de vraies différenciations : IA embarquée, optique repensée, autonomie améliorée. Voici notre sélection des meilleurs modèles selon différents profils.</p>

<h2>Le meilleur global : iPhone 16 Pro Max</h2>
<p>Apple continue de dominer sur l'écosystème et la durée de vie logicielle. La puce A18 Pro est la plus performante du marché, la photo Night Mode est exceptionnelle et Apple Intelligence apporte de vraies fonctionnalités IA. Prix : à partir de 1 329 €.</p>

<h2>Le meilleur Android : Samsung Galaxy S24 Ultra</h2>
<p>L'Ultra embarque un stylet S Pen, un zoom x100 et Galaxy AI pour des fonctions comme la transcription en direct et la traduction temps réel. Écran superbe. Prix : à partir de 1 419 €.</p>

<h2>Le meilleur rapport qualité-prix : Google Pixel 9</h2>
<p>Le Pixel offre la meilleure expérience photo computationnelle pour son prix (999 €), des mises à jour Android garanties 7 ans et Google Assistant ultra-intégré. Idéal pour ceux qui veulent le "vrai" Android.</p>

<h2>Le roi du prix : Xiaomi 14</h2>
<p>Avec son partenariat Leica pour la photo, son processeur Snapdragon 8 Gen 3 et son prix bien inférieur aux équivalents Apple/Samsung, le Xiaomi 14 (799 €) est l'opportunité de l'année.</p>

<h2>Comment choisir ?</h2>
<ul>
<li>Photo en priorité → iPhone ou Pixel</li>
<li>Productivité/S Pen → Samsung Ultra</li>
<li>Budget serré → Xiaomi, OnePlus, Nothing</li>
<li>Durée de vie logicielle → iPhone (6 ans) ou Pixel (7 ans)</li>
</ul>`,
  },
];

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }
  try {
    // Trouver ou créer un site de démo
    let site = await prisma.site.findFirst();
    if (!site) {
      site = await prisma.site.create({
        data: {
          name: "Mon Site Demo",
          url: "http://localhost:3000",
        },
      });
    }

    // Créer les catégories si elles n'existent pas
    const categoryMap: Record<string, string> = {};
    const uniqueCats = [...new Set(ARTICLES.map((a) => JSON.stringify({ label: a.category, slug: a.catSlug })))];
    for (const catStr of uniqueCats) {
      const { label, slug } = JSON.parse(catStr);
      const cat = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: { label, slug },
      });
      categoryMap[slug] = cat.label;
    }

    // Créer les articles
    let created = 0;
    let updated = 0;
    for (const art of ARTICLES) {
      const now = new Date();
      // Date de publication aléatoire dans les 12 derniers mois
      const publishedAt = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const wordCount = Math.floor(Math.random() * 600) + 400;

      const existing = await prisma.article.findUnique({
        where: { siteId_slug: { siteId: site.id, slug: art.slug } },
      });

      if (existing) {
        updated++;
        continue;
      }

      await prisma.article.create({
        data: {
          siteId: site.id,
          title: art.title,
          slug: art.slug,
          content: art.content,
          category: art.category,
          status: "published",
          imageUrl: art.imageUrl,
          metaDescription: art.metaDescription,
          publishedAt,
          wordCount,
          language: "FR",
        },
      });
      created++;
    }

    return NextResponse.json({
      ok: true,
      message: `Seed terminé : ${created} articles créés, ${updated} déjà existants.`,
      siteId: site.id,
    });
  } catch (err) {
    console.error("[GET /api/seed]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/parseJson";

export default async function CguPage() {
  const site = await prisma.site.findFirst();
  const menuConfig = site?.menuConfig != null ? parseJsonField(site.menuConfig) : null;
  const legalContent = (menuConfig as { legal?: { cgu?: { content?: string } } } | null)?.legal?.cgu?.content;
  const siteName = site?.name ?? "Maison & Conseil";

  return (
    <div className="ms-static">
      <p className="ms-eyebrow" style={{ marginBottom: 12 }}>Conditions d&apos;utilisation</p>
      <h1>Conditions générales d&apos;utilisation</h1>
      <div className="ms-divider" />

      {legalContent ? (
        <div dangerouslySetInnerHTML={{ __html: legalContent }} />
      ) : (
        <>
          <p>
            Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et l&apos;utilisation
            du site {siteName}. En accédant à ce site, vous acceptez sans réserve les présentes CGU.
          </p>

          <h2>1. Objet</h2>
          <p>
            Le site {siteName} est un magazine en ligne proposant des conseils et informations
            dans des domaines variés. L&apos;accès au site est gratuit et ouvert à tout utilisateur disposant
            d&apos;un accès à internet.
          </p>

          <h2>2. Accès au site</h2>
          <p>
            L&apos;éditeur met en œuvre les moyens nécessaires pour assurer la continuité du service.
            Toutefois, il ne peut être tenu responsable des interruptions dues à des opérations de maintenance,
            des défaillances techniques ou des problèmes de connectivité internet.
          </p>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus publiés sur ce site (textes, images, graphismes, logo, icônes)
            sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction,
            distribution ou utilisation à des fins commerciales est strictement interdite sans
            autorisation écrite préalable de l&apos;éditeur.
          </p>

          <h2>4. Responsabilité</h2>
          <p>
            Les informations publiées sur ce site sont fournies à titre informatif et indicatif.
            L&apos;éditeur s&apos;efforce de maintenir des informations à jour et exactes mais ne peut garantir
            leur exhaustivité. L&apos;utilisateur est seul responsable de l&apos;usage qu&apos;il fait des informations
            publiées sur ce site.
          </p>

          <h2>5. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre
            informatif uniquement. L&apos;éditeur n&apos;a aucun contrôle sur le contenu de ces sites
            et décline toute responsabilité quant aux informations qui y sont publiées.
          </p>

          <h2>6. Protection des données personnelles</h2>
          <p>
            La collecte et le traitement de vos données personnelles sont effectués conformément
            au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            Pour en savoir plus, consultez nos <a href="/mentions-legales">Mentions légales</a> et
            notre <a href="/cookies">Politique de cookies</a>.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation
            ou à leur exécution sera soumis aux tribunaux français compétents.
          </p>

          <h2>8. Modification des CGU</h2>
          <p>
            L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
            seront informés de toute modification substantielle par la publication d&apos;une nouvelle version
            sur cette page.
          </p>

          <p style={{ marginTop: 32, fontStyle: "italic", opacity: 0.7 }}>
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </>
      )}
    </div>
  );
}

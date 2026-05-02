import { prisma } from "@/lib/prisma";
import { parseJsonField } from "@/lib/parseJson";

export default async function CookiesPage() {
  const site = await prisma.site.findFirst();
  const menuConfig = site?.menuConfig != null ? parseJsonField(site.menuConfig) : null;
  const legalContent = (menuConfig as { legal?: { cookies?: { content?: string } } } | null)?.legal?.cookies?.content;

  return (
    <div className="ms-static">
      <p className="ms-eyebrow" style={{ marginBottom: 12 }}>Transparence &amp; données</p>
      <h1>Politique de cookies</h1>
      <div className="ms-divider" />

      {legalContent ? (
        <div dangerouslySetInnerHTML={{ __html: legalContent }} />
      ) : (
        <>
          <h2>Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette)
            lors de votre visite sur un site internet. Il permet au site de mémoriser des informations sur
            votre visite, comme votre langue préférée et d'autres paramètres.
          </p>

          <h2>Les cookies que nous utilisons</h2>
          <h3>Cookies strictement nécessaires</h3>
          <p>
            Ces cookies sont indispensables au bon fonctionnement du site. Ils ne peuvent pas être désactivés
            dans nos systèmes. Ils sont généralement définis en réponse à des actions que vous effectuez
            (connexion, session, préférences d'affichage).
          </p>

          <h3>Cookies de performance</h3>
          <p>
            Ces cookies nous permettent de compter les visites et les sources de trafic afin de mesurer et
            améliorer les performances de notre site. Toutes les informations collectées par ces cookies
            sont agrégées et donc anonymes.
          </p>

          <h3>Cookies de fonctionnalité</h3>
          <p>
            Ces cookies permettent au site d'offrir des fonctionnalités et une personnalisation améliorées.
            Si vous n'autorisez pas ces cookies, certaines fonctionnalités pourraient ne pas fonctionner correctement.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les cookies de session expirent à la fermeture de votre navigateur. Les cookies persistants
            ont une durée de vie maximale de 13 mois conformément aux recommandations de la CNIL.
          </p>

          <h2>Gérer vos préférences</h2>
          <p>
            Vous pouvez à tout moment modifier vos préférences concernant les cookies en paramétrant
            votre navigateur. La plupart des navigateurs vous permettent de refuser ou d'accepter les cookies.
            Notez que le refus de certains cookies peut altérer votre expérience de navigation.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative à notre utilisation des cookies, vous pouvez nous contacter
            à l'adresse indiquée sur notre page <a href="/contact">Contact</a>.
          </p>
        </>
      )}
    </div>
  );
}

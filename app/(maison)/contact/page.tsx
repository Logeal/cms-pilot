export default function ContactPage() {
  return (
    <div className="ms-static">
      <p className="ms-eyebrow" style={{ marginBottom: 12 }}>Nous joindre</p>
      <h1>Contact</h1>
      <div className="ms-divider" />
      <p>
        Vous avez une question, souhaitez nous proposer un sujet ou simplement
        échanger avec notre équipe ? Remplissez le formulaire ci-dessous — nous
        vous répondons sous 48h ouvrées.
      </p>

      <form className="ms-form">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="ms-form-row">
            <label htmlFor="name">Nom complet</label>
            <input type="text" id="name" name="name" placeholder="Votre nom" autoComplete="name" required />
          </div>
          <div className="ms-form-row">
            <label htmlFor="email">Adresse e-mail</label>
            <input type="email" id="email" name="email" placeholder="votre@email.fr" autoComplete="email" required />
          </div>
        </div>
        <div className="ms-form-row">
          <label htmlFor="subject">Sujet</label>
          <input type="text" id="subject" name="subject" placeholder="Objet de votre demande" required />
        </div>
        <div className="ms-form-row">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" placeholder="Décrivez votre demande..." required />
        </div>
        <button type="submit" className="ms-submit-btn">Envoyer mon message</button>
      </form>
    </div>
  );
}

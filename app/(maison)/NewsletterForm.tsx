"use client";

export default function NewsletterForm() {
  return (
    <div>
      <form
        className="ms-nl-form"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: intégration newsletter
        }}
      >
        <input
          type="email"
          className="ms-nl-input"
          placeholder="votre@email.fr"
          aria-label="Votre adresse e-mail"
        />
        <button type="submit" className="ms-nl-btn">
          Je m&apos;inscris
        </button>
      </form>
      <p className="ms-nl-legal">
        En vous inscrivant, vous acceptez de recevoir notre newsletter.
        Désabonnement en un clic, à tout moment.
      </p>
    </div>
  );
}

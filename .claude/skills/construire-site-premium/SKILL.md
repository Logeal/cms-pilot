---
name: construire-site-premium
description: Stack complète pour créer des sites web professionnels avec animations Framer Motion, composants 21st.dev et système UI/UX Pro Max. Sites qui paraissent designés à 10 000€.
---

# Construire Site Premium

## Ce que ce skill apporte

| Outil | Impact |
|-------|--------|
| **UI/UX Pro Max** | 50+ styles, 161 palettes, 57 associations de polices |
| **Framer Motion** | Animations fluides : transitions, scroll reveals, hover |
| **21st.dev Magic** | 100+ composants React production-ready |

## Principes design premium

### La règle du 10x
Avant de coder, demande : "Est-ce que ça a l'air d'un site à 500€ ou à 10 000€ ?"
La différence tient à 5 choses :
1. Espacement — les sites premium respirent (padding 80-120px sections)
2. Typographie — les tailles sont extrêmes, pas intermédiaires
3. Animations — subtiles, rapides (200-400ms), naturelles
4. Cohérence — même border-radius, même spacing unit partout
5. Détails — hover states, transitions, focus rings, empty states

### Animations qui font la différence (CSS pur)

```css
/* Révélation au chargement */
@keyframes revealUp {
  0%   { opacity: 0; transform: translateY(32px); }
  100% { opacity: 1; transform: translateY(0); }
}

.hero-content { animation: revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
.hero-visual  { animation: revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }

/* Cascade sur les cards */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 80ms; }
.card:nth-child(3) { animation-delay: 160ms; }
.card:nth-child(4) { animation-delay: 240ms; }
```

### Hover micro-interactions

```css
/* Card lift — pas de shadow au repos */
.card {
  transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}
.card:hover { transform: translateY(-6px); }

/* Image parallax subtil */
.card-img img {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.card:hover .card-img img { transform: scale(1.07); }

/* Bouton shimmer */
.btn {
  position: relative;
  overflow: hidden;
}
.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.12);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.btn:hover::after { transform: translateX(0); }
```

### Standards composants premium

**Hero section**
- Min-height : 70vh, jamais 100vh (laisse deviner qu'il y a du contenu en dessous)
- Split layout (texte | image) préféré au plein écran
- Animation sur le titre : revealUp avec easing spring

**Cards**
- Pas de box-shadow au repos → trop 2019
- Border 1px subtle OU background légèrement différent du fond
- Au hover : lift (-6px) + légère ombre longue
- Image toujours en haut ou à gauche, jamais à droite

**Navigation**
- Sticky avec backdrop-blur au scroll
- Hauteur réduite au scroll (68px → 52px)
- Transition sur tous les changements

**Footer**
- Toujours dark (même sur un site clair)
- Grande typographie display pour le nom de marque
- Séparateur visuel clair entre le contenu et le copyright

## Checklist avant livraison
- [ ] Tous les hover states sont définis
- [ ] Les animations ont des delays en cascade
- [ ] L'espacement des sections est 72px minimum
- [ ] La hiérarchie typographique est extrême (pas de tailles similaires)
- [ ] Les images ont toutes un border-radius cohérent
- [ ] Le site respire (pas trop chargé)
- [ ] Les CTA sont visibles immédiatement

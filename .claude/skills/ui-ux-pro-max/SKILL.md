---
name: ui-ux-pro-max
description: Bibliothèque de design avec 50+ styles, 161 palettes de couleurs, 57 associations de polices pour créer des interfaces qui paraissent designées, pas générées par l'IA
---

# UI/UX Pro Max Skill

## Philosophie centrale
Ne jamais produire quelque chose qui ressemble à du contenu AI générique. Chaque décision de design doit être intentionnelle, distinctive et mémorable.

## Les 3 règles d'or
1. **Hiérarchie visuelle extrême** — Contraste de taille radical entre les éléments (titre 72px vs corps 16px), pas de tailles intermédiaires mollassonnes
2. **Espacement généreux** — Padding et margins 2x plus grands que ce qui semble "normal". Le vide est un outil de design.
3. **Micro-interactions soignées** — Chaque élément cliquable doit répondre visuellement : lift au hover, transition de couleur, scale subtil

## Typographie — 57 associations recommandées

### Pour sites éditoriaux/magazine
- **Titres** : Georgia, Playfair Display, Cormorant Garamond — serif avec caractère
- **Corps** : system-ui, Inter, DM Sans — lisible et propre
- **Règle** : jamais deux polices de la même famille visuelle

### Hiérarchie typographique imposée
```
H1 display : 56-72px, weight 700-900, line-height 1.05-1.15
H2 section  : 32-42px, weight 700, line-height 1.2
H3 card     : 16-22px, weight 600-700, line-height 1.35
Body        : 15-18px, weight 400, line-height 1.65-1.8
Caption     : 11-13px, weight 500-700, uppercase, letter-spacing 0.08-0.12em
```

## Palettes — principes des 161 palettes

### Structure d'une palette réussie
- 1 couleur dominante (60% de la surface)
- 1 couleur secondaire/brand (30%)
- 1 couleur accent vive (10%) — jamais plus

### Ce qui différencie une palette premium
- Le fond n'est jamais blanc pur (#fff) → off-white chaud ou froid
- Le texte n'est jamais noir pur (#000) → charbon avec teinte
- L'accent est inattendu mais cohérent avec le secteur

## Composants UI — standards

### Cards
- Pas de box-shadow par défaut (old-school)
- Séparation par border 1px ou background-color subtil
- Au hover : `transform: translateY(-4px)` + légère ombre OU border-color change
- Transition : `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — courbe naturelle

### Boutons
- Hauteur minimum 44px (accessibilité + tap target)
- Padding horizontal : 2x la hauteur → 88px pour un bouton 44px
- Lettre-espacement : +0.04em sur les CTA uppercase
- États : default → hover (lighten 8%) → active (darken 4%) → focus (ring)

### Images
- Ne jamais étirer — object-fit: cover systématique
- Aspect-ratio imposé par la grille, pas par l'image
- Overlay gradient sur les images avec texte par-dessus
- Border-radius cohérent dans tout le site (0px OU 4-8px OU 12-16px, jamais mixé)

## Animations — ce qui fait la différence

### Entrée des sections
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Délais en cascade : 0ms, 100ms, 200ms, 300ms */
```

### Hover cards
```css
.card { transition: transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                    box-shadow 0.25s ease; }
.card:hover { transform: translateY(-4px); 
              box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
```

### Images au hover
```css
.img-wrap { overflow: hidden; }
.img-wrap img { transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.img-wrap:hover img { transform: scale(1.06); }
```

## 50+ styles design — catégories

1. **Editorial Premium** — grands blancs, serif, contraste extrême → presse haut de gamme
2. **Corporate Autoritaire** — foncé, lignes droites, typographie serrée → B2B
3. **Lifestyle Chaleureux** — beiges, courbes douces, photos lifestyle → maison/déco
4. **Tech Épuré** — monochrome, grid stricte, details techniques → SaaS
5. **Luxe Discret** — gold subtle, spacing maximal, peu d'éléments → premium
...et 45 autres

## Règles anti-générique absolues
- ❌ `box-shadow: 0 2px 8px rgba(0,0,0,0.1)` partout (trop commun)
- ❌ Cards avec rounded 12px + shadow + hover scale → template basique
- ❌ Gradient hero bleu/violet en background
- ❌ Boutons pill (border-radius: 9999px) sauf si justifié
- ❌ Grilles en 3 colonnes égales avec icône + titre + texte → section features classique

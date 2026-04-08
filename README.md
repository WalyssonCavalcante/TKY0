# MIEGAKURE — 見え隠れ

> Uma experiência editorial imersiva sobre Tokyo, onde o ritual ancestral e o futuro elétrico dividem o mesmo fôlego.

![Preview do projeto](screenshot.png)

## Sobre

MIEGAKURE (見え隠れ) é uma landing page temática sobre Tokyo construída com Angular 21. O projeto explora a dualidade entre tradição e modernidade da capital japonesa através de seções visuais ricas, animações cinematográficas e uma estética editorial escura inspirada em revistas de viagem premium.

## Funcionalidades

- **Hero imersivo** com partículas Three.js e parallax
- **Manifesto horizontal** com scroll pinado via GSAP + ScrollTrigger
- **Grid de histórias** com hover parallax nos cards
- **Distritos** com layout alternado e imagens parallax
- **Clima ao vivo** de Tokyo via Open-Meteo API (navbar)
- **Smooth scroll** via Lenis
- **Preloader** animado com contagem
- **Barra de progresso** de scroll
- **Totalmente responsivo** — mobile-first com breakpoints adaptáveis
- **Acessível** — skip-nav, aria-labels, focus-visible, `prefers-reduced-motion`
- **Performance** — NgOptimizedImage, imagens WebP, `@defer` com prefetch, zoneless change detection

## Tech Stack

- **Angular 21** — Zoneless, OnPush, Signals
- **Three.js** — Sistema de partículas no hero
- **GSAP + ScrollTrigger** — Animações e scroll horizontal
- **Lenis** — Smooth scrolling
- **Open-Meteo API** — Clima de Tokyo em tempo real
- **SCSS** — Tokens, design system customizado

## Começando

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
ng serve
```

Acesse `http://localhost:4200/`

## Build

```bash
ng build
```

Artifacts em `dist/tkyo/`.

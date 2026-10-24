# Lab 10 · Enrutamiento y Páginas (Next.js)

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx                 # Layout raíz
│   ├── page.tsx                   # Inicio
│   ├── not-found.tsx              # 404 global
│   ├── globals.css                # Tailwind + animaciones
│   ├── pokemon/                   # Ejercicio 1: Pokédex
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Lista (ISR, revalida cada 24 h)
│   │   ├── error.tsx
│   │   └── [name]/page.tsx        # Detalle (SSG con generateStaticParams)
│   └── rickandmorty/              # Tarea: Rick and Morty
│       ├── layout.tsx
│       ├── page.tsx               # Lista (SSR + force-cache)
│       ├── loading.tsx
│       ├── error.tsx
│       ├── not-found.tsx
│       └── [id]/page.tsx          # Detalle (SSG + ISR cada 10 días)
├── components/
│   └── rickandmorty/
│       ├── CharacterCard.tsx      # Card con lazy loading
│       ├── CharacterSearch.tsx    # Búsqueda en tiempo real (CSR)
│       ├── StatCounter.tsx
│       ├── PortalBackground.tsx
│       ├── PortalLoader.tsx
│       └── PortalVisual.tsx
├── lib/
│   └── rickandmorty.ts            # Peticiones a la API
└── types/
    ├── pokemon.ts
    └── character.ts
```

## Cómo iniciar

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

Build de producción:

```bash
npm run build
npm start
```

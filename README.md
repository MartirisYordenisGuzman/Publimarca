# Publimarca Studio — Independent Creative Atelier

Production web application for **Publimarca Studio** (Higüey, La Altagracia, Dominican Republic), built with Next.js App Router, React 18, TypeScript (strict mode), Tailwind CSS, Framer Motion, `next-intl`, and Lucide icons.

## Technology Stack

- **Framework**: Next.js 14 (App Router, Vercel-ready)
- **UI Runtime**: React 18 + TypeScript (`strict: true`)
- **Styling**: Tailwind CSS + `@tailwindcss/forms` + `@tailwindcss/container-queries`
- **Motion**: `framer-motion` (respecting `prefers-reduced-motion`)
- **Internationalization**: `next-intl` (`/en` and `/es` localized routes)
- **Icons**: `lucide-react`

## Architecture & Directory Structure

```text
Publimarca/
├── messages/
│   ├── en.json                 # English copy, metadata & validation strings
│   └── es.json                 # Spanish copy, metadata & validation strings
├── public/
│   └── logo.svg                # Vector studio emblem
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx      # Localized fonts, SEO metadata, NextIntlClientProvider
│   │   │   ├── page.tsx        # Main editorial composition
│   │   │   └── not-found.tsx   # Localized 404 route
│   │   ├── api/
│   │   │   └── commission/
│   │   │       └── route.ts    # Server validation, spam guard & webhook/Resend dispatch
│   │   ├── globals.css         # Tailwind layers & reduced-motion rules
│   │   ├── layout.tsx          # Root App Router layout
│   │   ├── robots.ts           # Dynamic robots.txt
│   │   └── sitemap.ts          # Dynamic bilingual sitemap.xml (/en, /es)
│   ├── components/
│   │   ├── Header.tsx          # Sticky header, live AST clock, EN/ES switcher & mobile drawer
│   │   ├── HeroSection.tsx     # Editorial hero, CTAs, metric ribbon & next/image studio frame
│   │   ├── ManifestoSection.tsx# Manifesto No. 01 block
│   │   ├── ServicesSection.tsx # 4 interactive capability modules
│   │   ├── PortfolioSection.tsx# Filterable case study grid + accessible dossier modal
│   │   ├── ProcessSection.tsx  # 4-Stage Cadence protocol
│   │   ├── TestimonialSection.tsx # Editorial quote block
│   │   ├── ContactSection.tsx  # Commission brief form with honest submission states
│   │   └── Footer.tsx          # 4-column studio coordinates & index footer
│   ├── i18n/
│   │   ├── request.ts          # next-intl server request configuration
│   │   └── routing.ts          # Locale routing (/en, /es) & navigation helpers
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces
│   └── middleware.ts           # Locale detection & routing middleware
├── .env.example                # Required & optional environment variables
├── next.config.mjs             # Next.js + next-intl + remote image optimization config
├── package.json                # Dependencies & scripts
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Brand tokens, colors, radii, and shadows
└── tsconfig.json               # Strict TypeScript configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000/en` or `http://localhost:3000/es`.

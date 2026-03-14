# Dependencies & Setup

## Requirements

- **Node.js**: v18.x LTS or higher
- **npm**: v9.x or higher

## Main Project

```bash
npm install
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nuxt | ^4.3.1 | Nuxt framework |
| vue | ^3.5.28 | Vue.js |
| vue-router | ^4.6.4 | Routing |
| @nuxtjs/sanity | ^2.2.0 | Sanity CMS integration |
| @sanity/image-url | ^2.0.3 | Sanity image URL builder |
| @iconify/vue | ^5.0.0 | Icon library |
| lenis | ^1.3.17 | Smooth scroll |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @nuxtjs/tailwindcss | ^6.14.0 | Tailwind CSS integration |

## Sanity Studio

```bash
cd sanity-studio
npm install
```

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| sanity | ^3.68.4 | Sanity CMS |
| styled-components | ^6.3.11 | Styling |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run generate` | Static generation |
| `npm run preview` | Preview production build |
| `npm run studio` | Start Sanity Studio |

## Environment Variables

Create `.env` in project root:

```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

## First-Time Setup

```bash
git clone <repo>
cd portfolio-second
npm install
cd sanity-studio && npm install && cd ..
npm run dev
```

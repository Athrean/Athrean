<div align="center">

  <img src="apps/web/public/cube.gif" width="280" alt="Athrean Wireframe Cube" />

  <h1>Athrean</h1>

  <p><strong>Vibe. Build. Ship. That Fast.</strong></p>

  <p>AI-powered app builder that turns your prompts into production-ready code.</p>

  <br />

  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

<br />

## What is Athrean?

Athrean is an AI-powered app builder designed for speed. Describe what you want to build, and watch it come to life with real-time preview and instant deployment capabilities.

### Key Features

- **Plan-First Architecture** — Creates detailed architecture plans before writing code, ensuring coherent, production-ready output
- **Smart Context Memory** — Maintains persistent project memory across sessions, remembering your requirements and past decisions
- **Component Library** — Access a curated library of production-ready components inspired by shadcn
- **Real-Time Preview** — See your app come to life as it's being built with Sandpack integration
- **One-Click Export** — Download your project or deploy instantly

<br />

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **3D Graphics** | Three.js, React Three Fiber |
| **Animation** | Framer Motion, Lenis |
| **AI** | Vercel AI SDK, OpenRouter |
| **Database** | Supabase |
| **State** | Zustand |
| **Monorepo** | Turborepo |

<br />

## Project Structure

```
athrean/
├── apps/
│   └── web/              # Main Next.js application
│       ├── app/          # App router pages
│       ├── components/   # React components
│       │   ├── landing/  # Landing page sections
│       │   ├── dashboard/# Dashboard components
│       │   ├── ui/       # Reusable UI components
│       │   └── backgrounds/ # Visual effects (Dither, etc.)
│       └── lib/          # Utilities and configurations
├── content/              # Content and documentation
├── scripts/              # Build scripts
└── supabase/             # Database migrations
```

<br />

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- Supabase account (for auth & database)

### Installation

```bash
# Clone the repository
git clone https://github.com/Athrean/Athrean.git
cd athrean

# Install dependencies
bun install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local

# Start the development server
bun dev
```

### Environment Variables

Create a `.env.local` file in `apps/web/` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENROUTER_API_KEY=your_openrouter_key
TURNSTILE_SECRET_KEY=your_turnstile_secret
```

<br />

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun typecheck` | Run TypeScript type checking |

<br />

## Contributing

We're building in public and welcome contributions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br />

## Community

- **[Twitter / X](https://x.com/athreanai)** — Follow for updates
- **[GitHub Issues](https://github.com/Athrean/Athrean/issues)** — Report bugs & request features
- **[Discord](https://discord.gg/athrean)** — Join the community

<br />

## License

This project is proprietary software. All rights reserved.

<br />

<div align="center">
  <sub>Built with AI + Creativity</sub>
</div>

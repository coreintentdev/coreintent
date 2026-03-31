# Contributing to CoreIntent

## How to Contribute
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Open Pull Request

## Development Setup
```bash
git clone https://github.com/coreintentdev/coreintent.git
cd coreintent
npm install
cp .env.example .env   # Add your API keys
npm run dev             # http://localhost:3000
```

## Build & Lint
```bash
npm run build    # Production build (must pass clean)
npm run lint     # ESLint check
```

## Rules
- Build passes clean or you don't push
- Label demo data honestly — no fake green dots
- Read CLAUDE.md before making changes
- NZ-first for all legal/business decisions

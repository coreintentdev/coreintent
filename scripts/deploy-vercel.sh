#!/bin/bash
# ═══════════════════════════════════════════
# CoreIntent — Deploy to Vercel
# Run from project root: ./scripts/deploy-vercel.sh
# ═══════════════════════════════════════════

set -e

echo "═══════════════════════════════════════"
echo " CoreIntent → Vercel Deployment"
echo "═══════════════════════════════════════"

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo "ERROR: Run this from the coreintent project root"
  exit 1
fi

# Check vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm i -g vercel
fi

# Check login
echo ""
echo "Step 1: Vercel login (if not already logged in)"
vercel whoami 2>/dev/null || vercel login

# Build locally first to make sure it passes
echo ""
echo "Step 2: Local build check..."
npm run build

# Deploy to production
echo ""
echo "Step 3: Deploying to Vercel production..."
vercel --prod

echo ""
echo "═══════════════════════════════════════"
echo " DEPLOYED!"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Set env vars: vercel env add ANTHROPIC_API_KEY"
echo "  2. Set env vars: vercel env add GROK_API_KEY"
echo "  3. Set env vars: vercel env add PERPLEXITY_API_KEY"
echo "  4. Connect domain: vercel domains add coreintent.dev"
echo "  5. Redeploy with env: vercel --prod"
echo ""

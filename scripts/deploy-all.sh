#!/bin/bash
# ═══════════════════════════════════════════
# CoreIntent — FULL DEPLOYMENT
# Deploys: Vercel (web) + VDS (trading engine)
# Run from project root: ./scripts/deploy-all.sh
# ═══════════════════════════════════════════

set -e

echo ""
echo "  ██████╗ ██████╗ ██████╗ ███████╗██╗███╗   ██╗████████╗███████╗███╗   ██╗████████╗"
echo " ██╔════╝██╔═══██╗██╔══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝"
echo " ██║     ██║   ██║██████╔╝█████╗  ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║   "
echo " ██║     ██║   ██║██╔══██╗██╔══╝  ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║   "
echo " ╚██████╗╚██████╔╝██║  ██║███████╗██║██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║   "
echo "  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝"
echo ""
echo " FULL DEPLOYMENT — Vercel + VDS"
echo " Built by Corey McIvor (@coreintentdev)"
echo ""

# Pre-flight
echo "═══ Pre-flight checks ═══"

if [ ! -f "package.json" ]; then
  echo "ERROR: Run from coreintent project root"
  exit 1
fi

echo "✓ Project root OK"

npm run build > /dev/null 2>&1 && echo "✓ Build passes" || {
  echo "✗ Build failed — fix errors first"
  npm run build
  exit 1
}

echo ""
echo "═══ Phase 1: Vercel (Web App) ═══"
echo ""
bash scripts/deploy-vercel.sh

echo ""
echo "═══ Phase 2: VDS (Trading Engine) ═══"
echo ""
bash scripts/deploy-vds.sh

echo ""
echo "═══════════════════════════════════════"
echo " FULL DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════"
echo ""
echo " Web App:        Live on Vercel"
echo " Risk Monitor:   Running on VDS"
echo " Signal Listener: Running on VDS"
echo " gTrade Scanner: Running on VDS"
echo ""
echo " Next: Set API keys in Vercel dashboard"
echo " and in VDS .env file"
echo ""
echo " Share to care. — Corey"
echo ""

#!/bin/bash
# ═══════════════════════════════════════════
# CoreIntent — FULL DEPLOYMENT
# Deploys: Vercel (web) + VPS (trading engine)
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
echo " FULL DEPLOYMENT — Vercel + VPS"
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
echo "═══ Phase 2: VPS (Trading Engine) ═══"
echo ""
bash scripts/deploy-vps.sh

echo ""
echo "═══════════════════════════════════════"
echo " FULL DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════"
echo ""
echo " Web App:        Live on Vercel"
echo " Risk Monitor:   Running on VPS"
echo " Signal Listener: Running on VPS"
echo " gTrade Scanner: Running on VPS"
echo ""
echo " Next: Set API keys in Vercel dashboard"
echo " and in VPS .env file"
echo ""
echo " Share to care. — Corey"
echo ""

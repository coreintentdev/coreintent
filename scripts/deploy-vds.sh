#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CoreIntent — VDS Consolidation Deploy
# Deploys EVERYTHING to a single VDS: web app + trading engine +
# reverse proxy + SSL + systemd services.
#
# Replaces: 3x VPS (Cloudzy + Frankfurt + 3rd) → 1x VDS
# Run from project root: ./scripts/deploy-vds.sh
#
# Usage:
#   VDS_HOST=your.vds.ip VDS_USER=root ./scripts/deploy-vds.sh
#   Or set VDS_HOST/VDS_USER/VDS_PASS as env vars or secrets
# ═══════════════════════════════════════════════════════════════

set -e

VDS_HOST="${VDS_HOST:?Set VDS_HOST — Tailscale hostname or IP}"
VDS_USER="${VDS_USER:-root}"
REMOTE_DIR="/root/coreintent"
DOMAIN="${DOMAIN:-coreintent.dev}"
NODE_VERSION="20"
# Tailscale SSH — no passwords needed

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN} CoreIntent → VDS Consolidation Deploy${NC}"
echo -e "${CYAN} Target: ${VDS_USER}@${VDS_HOST}${NC}"
echo -e "${CYAN} Domain: ${DOMAIN}${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""

if [ ! -f "package.json" ]; then
  echo -e "${RED}ERROR: Run this from the coreintent project root${NC}"
  exit 1
fi

# Tailscale SSH — no passwords, no keys, just works
ssh_run() { ssh -o ConnectTimeout=15 ${VDS_USER}@${VDS_HOST} "$1"; }
scp_to() { scp -o ConnectTimeout=15 $1 ${VDS_USER}@${VDS_HOST}:$2; }

# ═══════════════════════════════════════════
# PHASE 1: Connection + System Setup
# ═══════════════════════════════════════════
echo -e "${CYAN}[1/8] Testing SSH connection...${NC}"
ssh_run "echo 'Connected to VDS'" || {
  echo -e "${RED}Cannot connect to ${VDS_HOST}${NC}"
  echo "Fix: ssh ${VDS_USER}@${VDS_HOST}"
  exit 1
}
echo -e "${GREEN}Connected.${NC}"

echo -e "${CYAN}[2/8] Installing system dependencies...${NC}"
ssh_run "
  apt-get update -qq &&
  apt-get install -y -qq curl git nginx certbot python3-certbot-nginx ufw &&
  # Node.js
  if ! command -v node &>/dev/null || [ \"\$(node -v | cut -d. -f1 | tr -d v)\" -lt ${NODE_VERSION} ]; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - &&
    apt-get install -y -qq nodejs
  fi &&
  npm install -g tsx pm2 2>/dev/null
  echo 'System deps OK'
"
echo -e "${GREEN}System ready.${NC}"

# ═══════════════════════════════════════════
# PHASE 2: Deploy Codebase
# ═══════════════════════════════════════════
echo -e "${CYAN}[3/8] Deploying codebase...${NC}"
ssh_run "mkdir -p ${REMOTE_DIR}/{scripts,lib,public,app,.next}"

# Build locally first
echo "  Building locally..."
npm run build > /dev/null 2>&1 || {
  echo -e "${RED}Build failed locally. Fix before deploying.${NC}"
  npm run build
  exit 1
}
echo -e "${GREEN}  Build passes.${NC}"

# Copy essential files
echo "  Copying files..."
scp_to "package.json" "${REMOTE_DIR}/"
scp_to "package-lock.json" "${REMOTE_DIR}/"
scp_to "tsconfig.json" "${REMOTE_DIR}/"
scp_to "next.config.js" "${REMOTE_DIR}/"
scp_to "lib/ai.ts" "${REMOTE_DIR}/lib/"
scp_to "scripts/risk_monitor.ts" "${REMOTE_DIR}/scripts/"
scp_to "scripts/signal_listener.ts" "${REMOTE_DIR}/scripts/"
scp_to "scripts/gtrade_listener.ts" "${REMOTE_DIR}/scripts/"

# Copy app directory
eval "$SCP_CMD -r app/ ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/"
eval "$SCP_CMD -r components/ ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/"
eval "$SCP_CMD -r public/ ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/"

# Copy .env
if [ -f ".env" ]; then
  scp_to ".env" "${REMOTE_DIR}/"
  echo "  .env copied"
else
  scp_to ".env.example" "${REMOTE_DIR}/.env.example"
  echo -e "${YELLOW}  No .env — copied .env.example. Fill in keys on VDS.${NC}"
fi

echo -e "${GREEN}Codebase deployed.${NC}"

# ═══════════════════════════════════════════
# PHASE 3: Install + Build on VDS
# ═══════════════════════════════════════════
echo -e "${CYAN}[4/8] Installing dependencies on VDS...${NC}"
ssh_run "cd ${REMOTE_DIR} && npm ci --production=false 2>&1 | tail -3"
echo -e "${GREEN}Dependencies installed.${NC}"

echo -e "${CYAN}[5/8] Building on VDS...${NC}"
ssh_run "cd ${REMOTE_DIR} && npm run build 2>&1 | tail -5"
echo -e "${GREEN}Build complete.${NC}"

# ═══════════════════════════════════════════
# PHASE 4: PM2 Services
# ═══════════════════════════════════════════
echo -e "${CYAN}[6/8] Setting up PM2 services...${NC}"
ssh_run "
  cd ${REMOTE_DIR}

  # Web app — Next.js on port 3000
  pm2 delete coreintent-web 2>/dev/null || true
  pm2 start npm --name coreintent-web -- start

  # Trading engine scripts
  pm2 delete coreintent-risk 2>/dev/null || true
  pm2 start npx --name coreintent-risk -- tsx scripts/risk_monitor.ts

  pm2 delete coreintent-signals 2>/dev/null || true
  pm2 start npx --name coreintent-signals -- tsx scripts/signal_listener.ts

  pm2 delete coreintent-gtrade 2>/dev/null || true
  pm2 start npx --name coreintent-gtrade -- tsx scripts/gtrade_listener.ts

  # Save + auto-start on reboot
  pm2 save
  pm2 startup systemd -u ${VDS_USER} --hp /root 2>/dev/null | tail -1 | bash 2>/dev/null || true

  echo 'PM2 services configured'
  pm2 list
"
echo -e "${GREEN}Services running.${NC}"

# ═══════════════════════════════════════════
# PHASE 5: Nginx Reverse Proxy
# ═══════════════════════════════════════════
echo -e "${CYAN}[7/8] Configuring Nginx reverse proxy...${NC}"
ssh_run "
  cat > /etc/nginx/sites-available/coreintent << 'NGINX'
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
NGINX

  ln -sf /etc/nginx/sites-available/coreintent /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default
  nginx -t && systemctl reload nginx
  echo 'Nginx configured'
"
echo -e "${GREEN}Nginx running.${NC}"

# ═══════════════════════════════════════════
# PHASE 6: Firewall + SSL
# ═══════════════════════════════════════════
echo -e "${CYAN}[8/8] Firewall + SSL...${NC}"
ssh_run "
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  echo 'Firewall set: 22, 80, 443'

  # SSL — only if domain resolves to this IP
  if host ${DOMAIN} 2>/dev/null | grep -q '${VDS_HOST}'; then
    certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m corey@coreyai.ai || echo 'SSL: domain not pointing here yet'
  else
    echo 'SSL skipped — point ${DOMAIN} DNS to ${VDS_HOST} first, then run:'
    echo '  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m corey@coreyai.ai'
  fi
"
echo -e "${GREEN}Firewall + SSL done.${NC}"

# ═══════════════════════════════════════════
# DONE
# ═══════════════════════════════════════════
echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN} VDS CONSOLIDATION COMPLETE${NC}"
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo ""
echo "  Web App:         http://${VDS_HOST}:3000 (direct)"
echo "  Web App:         http://${DOMAIN} (via Nginx)"
echo "  Risk Monitor:    PM2 — coreintent-risk"
echo "  Signal Listener: PM2 — coreintent-signals"
echo "  gTrade Scanner:  PM2 — coreintent-gtrade"
echo ""
echo "  Manage:"
echo "    ssh ${VDS_USER}@${VDS_HOST} pm2 list"
echo "    ssh ${VDS_USER}@${VDS_HOST} pm2 logs coreintent-web"
echo "    ssh ${VDS_USER}@${VDS_HOST} pm2 restart all"
echo ""
echo "  After confirming everything works, close the old VPS accounts:"
echo "    - Cloudzy:   100.122.99.34"
echo "    - Frankfurt: 104.194.156.109"
echo "    - 3rd VPS:   (check your accounts)"
echo ""
echo "  336 — consolidated."
echo ""

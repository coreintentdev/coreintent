#!/bin/bash
# ═══════════════════════════════════════════
# CoreIntent — Deploy VDS Scripts to Cloudzy
# Run from project root: ./scripts/deploy-vds.sh
# ═══════════════════════════════════════════

set -e

VDS_HOST="${VDS_HOST:-vmi3205024}"
VDS_USER="${VDS_USER:-root}"
REMOTE_DIR="/root/coreintent"

echo "═══════════════════════════════════════"
echo " CoreIntent → VDS Deployment"
echo " Target: ${VDS_USER}@${VDS_HOST}"
echo "═══════════════════════════════════════"

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo "ERROR: Run this from the coreintent project root"
  exit 1
fi

# Test SSH connection
echo ""
echo "Step 1: Testing SSH connection..."
ssh -o ConnectTimeout=10 ${VDS_USER}@${VDS_HOST} "echo 'SSH OK — connected to VDS'" || {
  echo "ERROR: Cannot connect to ${VDS_HOST}"
  echo "Make sure you can: ssh ${VDS_USER}@${VDS_HOST}"
  exit 1
}

# Create remote directory structure
echo ""
echo "Step 2: Setting up remote directories..."
ssh ${VDS_USER}@${VDS_HOST} "mkdir -p ${REMOTE_DIR}/scripts ${REMOTE_DIR}/lib"

# Copy files
echo ""
echo "Step 3: Copying scripts and dependencies..."
scp scripts/risk_monitor.ts ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/scripts/
scp scripts/signal_listener.ts ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/scripts/
scp scripts/gtrade_listener.ts ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/scripts/
scp lib/ai.ts ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/lib/
scp package.json ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/
scp tsconfig.json ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/

# Copy .env if it exists
if [ -f ".env" ]; then
  echo "Copying .env..."
  scp .env ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/
else
  echo "WARNING: No .env file found. Copy .env.example and fill in your keys."
  scp .env.example ${VDS_USER}@${VDS_HOST}:${REMOTE_DIR}/.env.example
fi

# Install dependencies and start
echo ""
echo "Step 4: Installing dependencies on VDS..."
ssh ${VDS_USER}@${VDS_HOST} "cd ${REMOTE_DIR} && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>/dev/null && apt-get install -y nodejs 2>/dev/null; npm install --production 2>/dev/null; npm install -g tsx 2>/dev/null"

# Create systemd services for each script
echo ""
echo "Step 5: Creating systemd services..."

# Risk Monitor service
ssh ${VDS_USER}@${VDS_HOST} "cat > /etc/systemd/system/coreintent-risk.service << 'UNIT'
[Unit]
Description=CoreIntent Risk Monitor
After=network.target

[Service]
Type=simple
WorkingDirectory=${REMOTE_DIR}
ExecStart=/usr/bin/npx tsx scripts/risk_monitor.ts
Restart=always
RestartSec=10
EnvironmentFile=${REMOTE_DIR}/.env

[Install]
WantedBy=multi-user.target
UNIT"

# Signal Listener service
ssh ${VDS_USER}@${VDS_HOST} "cat > /etc/systemd/system/coreintent-signals.service << 'UNIT'
[Unit]
Description=CoreIntent Signal Listener
After=network.target

[Service]
Type=simple
WorkingDirectory=${REMOTE_DIR}
ExecStart=/usr/bin/npx tsx scripts/signal_listener.ts
Restart=always
RestartSec=10
EnvironmentFile=${REMOTE_DIR}/.env

[Install]
WantedBy=multi-user.target
UNIT"

# gTrade Listener service
ssh ${VDS_USER}@${VDS_HOST} "cat > /etc/systemd/system/coreintent-gtrade.service << 'UNIT'
[Unit]
Description=CoreIntent gTrade DeFi Listener
After=network.target

[Service]
Type=simple
WorkingDirectory=${REMOTE_DIR}
ExecStart=/usr/bin/npx tsx scripts/gtrade_listener.ts
Restart=always
RestartSec=10
EnvironmentFile=${REMOTE_DIR}/.env

[Install]
WantedBy=multi-user.target
UNIT"

# Enable and start services
echo ""
echo "Step 6: Starting services..."
ssh ${VDS_USER}@${VDS_HOST} "systemctl daemon-reload && \
  systemctl enable coreintent-risk coreintent-signals coreintent-gtrade && \
  systemctl restart coreintent-risk coreintent-signals coreintent-gtrade"

# Check status
echo ""
echo "Step 7: Checking service status..."
ssh ${VDS_USER}@${VDS_HOST} "systemctl status coreintent-risk --no-pager -l | head -10; echo '---'; \
  systemctl status coreintent-signals --no-pager -l | head -10; echo '---'; \
  systemctl status coreintent-gtrade --no-pager -l | head -10"

echo ""
echo "═══════════════════════════════════════"
echo " VDS DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════"
echo ""
echo "Services running on ${VDS_HOST}:"
echo "  - coreintent-risk     (circuit breaker @ 0.8%)"
echo "  - coreintent-signals  (Grok + Claude validation)"
echo "  - coreintent-gtrade   (DeFi scanner)"
echo ""
echo "Manage:"
echo "  ssh ${VDS_USER}@${VDS_HOST} systemctl status coreintent-risk"
echo "  ssh ${VDS_USER}@${VDS_HOST} journalctl -u coreintent-risk -f"
echo "  ssh ${VDS_USER}@${VDS_HOST} systemctl restart coreintent-risk"
echo ""

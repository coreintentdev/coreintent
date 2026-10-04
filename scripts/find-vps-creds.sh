#!/bin/bash
# ═══════════════════════════════════════════
# Find VPS info — Tailscale network
# Run on YOUR Mac: bash scripts/find-vps-creds.sh
# ═══════════════════════════════════════════

MASTER="${HOME}/Desktop/ZYNTHIO_MASTER"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo ""
echo -e "${CYAN}═══ VPS Finder (Tailscale) ═══${NC}"
echo -e "${CYAN}Scanning: ${MASTER}${NC}"
echo ""

echo -e "${YELLOW}── Tailscale Status ──${NC}"
if command -v tailscale &>/dev/null; then
  tailscale status 2>/dev/null || echo "  Tailscale installed but not connected"
else
  echo "  Tailscale CLI not found"
fi
echo ""

# Search everywhere
SEARCH_DIRS=(
  "$MASTER"
  "$HOME/Desktop"
  "$HOME/Documents"
  "$HOME/.ssh"
)

echo -e "${YELLOW}── SSH Keys ──${NC}"
find "${HOME}/.ssh" -type f ! -name "*.pub" ! -name "known_hosts" ! -name "config" ! -name "authorized_keys" 2>/dev/null | while read f; do
  echo -e "  ${GREEN}KEY:${NC} $f"
done

echo ""
echo -e "${YELLOW}── SSH Config ──${NC}"
if [ -f "$HOME/.ssh/config" ]; then
  echo -e "  ${GREEN}Found:${NC} $HOME/.ssh/config"
  grep -A3 -i "host\|hostname\|user\|identityfile" "$HOME/.ssh/config" 2>/dev/null | head -40
else
  echo "  No SSH config found"
fi

echo ""
echo -e "${YELLOW}── .env files with VPS/SSH info ──${NC}"
for DIR in "${SEARCH_DIRS[@]}"; do
  find "$DIR" -maxdepth 5 -name ".env" -o -name ".env.*" -o -name "*.env" 2>/dev/null | while read f; do
    HAS_VPS=$(grep -il "VPS_HOST\|VPS_PASS\|VPS_USER\|SSH_KEY\|CLOUDZY\|100\.122\|104\.194" "$f" 2>/dev/null)
    if [ -n "$HAS_VPS" ]; then
      echo -e "  ${GREEN}MATCH:${NC} $f"
      grep -i "VPS_HOST\|VPS_PASS\|VPS_USER\|VPS_SSH\|SSH_KEY\|CLOUDZY\|FRANKFURT" "$f" 2>/dev/null | sed 's/^/    /'
    fi
  done
done

echo ""
echo -e "${YELLOW}── Files mentioning VPS IPs ──${NC}"
for DIR in "${SEARCH_DIRS[@]}"; do
  grep -rl "100\.122\.99\.34\|104\.194\.156\.109" "$DIR" --include="*.md" --include="*.txt" --include="*.json" --include="*.env" --include="*.sh" 2>/dev/null | head -20 | while read f; do
    echo -e "  ${GREEN}FILE:${NC} $f"
  done
done

echo ""
echo -e "${YELLOW}── 06_VPS folder contents ──${NC}"
if [ -d "$MASTER/06_VPS" ]; then
  ls -la "$MASTER/06_VPS/" 2>/dev/null
  echo ""
  echo -e "${YELLOW}── Contents of files in 06_VPS ──${NC}"
  for f in "$MASTER/06_VPS"/*; do
    [ -f "$f" ] || continue
    echo -e "\n  ${GREEN}=== $(basename "$f") ===${NC}"
    cat "$f" 2>/dev/null | head -50
  done
else
  echo "  06_VPS folder not found. Checking for VPS files elsewhere..."
  find "$MASTER" -maxdepth 3 -iname "*vps*" -o -iname "*cloudzy*" -o -iname "*ssh*" -o -iname "*server*" -o -iname "*deploy*" 2>/dev/null | while read f; do
    echo -e "  ${GREEN}FOUND:${NC} $f"
  done
fi

echo ""
echo -e "${YELLOW}── VPS state files (if mirrored) ──${NC}"
find "$MASTER" -name "SESSION_STATE.md" -o -name "MASTER_HANDOVER.md" -o -name "COREY_WORDS.md" 2>/dev/null | while read f; do
  echo -e "  ${GREEN}STATE:${NC} $f"
  grep -i "host\|ip\|server\|ssh\|pass\|credential\|cloudzy\|frankfurt" "$f" 2>/dev/null | head -10 | sed 's/^/    /'
done

echo ""
echo -e "${YELLOW}── Known hosts with VPS IPs ──${NC}"
grep "100\.122\.99\.34\|104\.194\.156\.109" "$HOME/.ssh/known_hosts" 2>/dev/null | while read line; do
  echo -e "  ${GREEN}KNOWN:${NC} $(echo "$line" | cut -d' ' -f1)"
done

echo ""
echo -e "${CYAN}═══════════════════════════════════════════${NC}"
echo -e "${CYAN}Done. Use what you found above to deploy:${NC}"
echo ""
echo "  VDS_HOST=<ip> VDS_USER=root VDS_PASS=<pass> ./scripts/deploy-vds.sh"
echo ""
echo "  Or if SSH key works:"
echo "  VDS_HOST=<ip> ./scripts/deploy-vds.sh"
echo ""

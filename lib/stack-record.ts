/**
 * Counts and hosts for this website only.
 *
 * The paid inventories already exist. Do not ask the operator to list them again.
 * - Connector map, 2026-03-23: 22 Perplexity services, 363 tools, 11 VPS key names.
 *   Drive file CC_HANDOVER_API_CONNECTOR_MAP.md.
 * - Fleet map, 2026-09-30: 842 domains, 111 generated sites.
 *   coreintentai ops/handover/cursor-incidents-20261001/ZYNTHIO-MAPS-20260930.md
 * - Trading engine code: github.com/coreintentdev/coreintentai
 *
 * Hosts below are copied from that September map. This session did not probe them.
 */

export const API_ROUTES = [
  "agents",
  "autosave",
  "connections",
  "content",
  "health",
  "incidents",
  "market",
  "notes",
  "portfolio",
  "protect",
  "research",
  "signals",
  "status",
  "sync",
] as const;

export const API_ROUTE_COUNT = API_ROUTES.length;

export const VDS = {
  provider: "Contabo",
  publicHost: "5.189.143.170",
  tailscaleHost: "100.121.107.112",
  retiredCloudzyHost: "100.122.99.34",
  scriptsDeployed: false,
  probedThisSession: false,
} as const;

export const VDS_LABEL = "Contabo VDS";
export const VDS_STATUS = "not_deployed" as const;

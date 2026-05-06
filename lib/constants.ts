/** Single source of truth for project-level constants shared across routes and libs. */

/** Semver version of this deployment — keep in sync with package.json. */
export const APP_VERSION = "0.2.0-alpha";

/** Platform mode — changes to "live" once real exchange connections are wired. */
export const PLATFORM_MODE = "paper_trading" as const;

/** Union type for platform mode — use in route response interfaces. */
export type PlatformMode = typeof PLATFORM_MODE;

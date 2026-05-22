// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — CLIENT DATA REGISTRY
// Production-safe facade. Contains no demo/mock exports at module level.
//
// DEMO_CLIENTS, DEMO_MESSAGES, getAnalyticsData are dev-only and gated.
// They are never exported at the top level of this file.
// Import from /dev/mockClients.js for development/admin preview use only.
//
// ADMIN_USER has been moved to /data/adminUser.js (production-safe).
// ─────────────────────────────────────────────────────────────────────────────

// Empty production client registry — clients are loaded at runtime
// from the activation/registry system (academyIdentity.js + academyLicense.js).
// No static client records ship with the production bundle.

export const CLIENT_REGISTRY_VERSION = '3.0.0'

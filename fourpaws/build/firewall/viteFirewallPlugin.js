// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — VITE FIREWALL PLUGIN
// viteFirewallPlugin.js
//
// Vite build plugin — runs during module resolution.
// Inspects every resolved module ID during production builds.
// If a forbidden pattern is found in the module graph, throws a build error.
//
// This is the second firewall layer — catches any contamination
// that reaches the bundler graph even after the pre-build guard passes.
//
// Add to vite.config.js:
//   import { fourPawsFirewallPlugin } from './build/firewall/viteFirewallPlugin.js'
//   plugins: [..., fourPawsFirewallPlugin()]
// ─────────────────────────────────────────────────────────────────────────────

const FORBIDDEN_MODULE_PATTERNS = [
  /\/mockData\.(js|ts|jsx|tsx)$/,
  /\/seedData\.(js|ts|jsx|tsx)$/,
  /\/testData\.(js|ts|jsx|tsx)$/,
  /\/demoData\.(js|ts|jsx|tsx)$/,
  /\/fakeData\.(js|ts|jsx|tsx)$/,
  /\/devData\.(js|ts|jsx|tsx)$/,
  /\/fixtures\.(js|ts|jsx|tsx)$/,
  /\/dev\/.*\.(js|ts|jsx|tsx)$/,
  /\/__mocks__\/.*\.(js|ts|jsx|tsx)$/,
]

// DEMO_ exports inside data files that ship to production
const FORBIDDEN_CONTENT_PATTERNS = [
  /export\s+(const|let|var)\s+DEMO_/,
  /export\s+(const|let|var)\s+MOCK_/,
  /export\s+(const|let|var)\s+SEED_/,
  /export\s+(const|let|var)\s+TEST_FIXTURE/,
]

// Files that are known to contain demo exports — must be gated
const KNOWN_DEMO_DATA_FILES = [
  '/data/clients.js',
  '/data/courses.js',
]

export function fourPawsFirewallPlugin() {
  let isProd = false

  return {
    name: 'four-paws-firewall',
    enforce: 'pre',

    configResolved(config) {
      // Only hard-block when FP_ENFORCE_FIREWALL=1 is explicitly set.
      // Vite sets NODE_ENV=production for ALL builds — we need a separate
      // explicit signal to distinguish a real production deploy from a
      // local dev build. The Vercel build command sets this var.
      isProd = config.command === 'build' && process.env.FP_ENFORCE_FIREWALL === '1'
    },

    resolveId(source, importer) {
      if (!isProd) return null

      // Check if the import source matches a forbidden pattern
      for (const pattern of FORBIDDEN_MODULE_PATTERNS) {
        if (pattern.test(source)) {
          this.error(
            `\n[FOUR PAWS FIREWALL] DEPLOY BLOCKED: MOCK DATA DETECTED IN PRODUCTION BUNDLE\n` +
            `Forbidden module: ${source}\n` +
            `Imported from: ${importer || 'unknown'}\n` +
            `Mock data must never be included in the production bundle graph.`
          )
        }
      }
      return null
    },

    transform(code, id) {
      if (!isProd) return null

      // Check if this is a known demo data file being bundled
      const isKnownDemoFile = KNOWN_DEMO_DATA_FILES.some(path => id.endsWith(path))
      if (isKnownDemoFile) {
        for (const pattern of FORBIDDEN_CONTENT_PATTERNS) {
          if (pattern.test(code)) {
            this.error(
              `\n[FOUR PAWS FIREWALL] DEPLOY BLOCKED: MOCK DATA DETECTED IN PRODUCTION BUNDLE\n` +
              `File: ${id}\n` +
              `Contains demo/mock export: ${code.match(pattern)?.[0] || 'unknown'}\n` +
              `Demo exports must be excluded from production builds. ` +
              `Wrap in: if (process.env.NODE_ENV !== 'production') { ... }`
            )
          }
        }
      }

      return null
    },
  }
}

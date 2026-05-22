// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — SAFE IMPORT GUARD
// safeImport.js
//
// Runtime enforcement wrapper.
// Blocks forbidden module imports at runtime when NODE_ENV === "production".
//
// Usage (in any module that conditionally imports data):
//   import { safeImport } from '../build/firewall/safeImport.js'
//   const { DEMO_CLIENTS } = safeImport(() => import('../../data/clients.js'))
//
// In production builds: throws immediately if the module path is forbidden.
// In development:       passes through transparently.
// ─────────────────────────────────────────────────────────────────────────────

const FORBIDDEN_PROD_PATHS = [
  'mockData',
  'seedData',
  'testData',
  'demoData',
  'fakeData',
  'devData',
  'fixtures',
  '/dev/',
  '/test/',
  '/__mocks__/',
]

/**
 * safeImport — compile-time enforced import guard.
 *
 * Wraps any dynamic import factory. In production, inspects the factory
 * source string for forbidden path patterns and throws before the import
 * resolves. In development, passes through transparently.
 *
 * @param {Function} importFactory — () => import('path/to/module')
 * @returns {Promise<any>} — the module, if allowed
 * @throws {Error} — in production if the path is forbidden
 */
export function safeImport(importFactory) {
  const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'

  // Extract the path string from the factory's source for static analysis
  const factorySource = importFactory.toString()

  if (isProd) {
    for (const pattern of FORBIDDEN_PROD_PATHS) {
      if (factorySource.includes(pattern)) {
        throw new Error(
          `[FOUR PAWS FIREWALL] DEPLOY BLOCKED: Forbidden import path detected in production build.\n` +
          `Pattern: "${pattern}"\n` +
          `Import: ${factorySource}\n` +
          `Mock and demo data must never reach a production bundle.`
        )
      }
    }
  }

  return importFactory()
}

/**
 * assertNotMockData — direct assertion for use in any module.
 * Call at the top of any data-adjacent module to assert it is not
 * being consumed in production.
 *
 * @param {string} moduleName — the name of the calling module (for logging)
 */
export function assertNotMockData(moduleName) {
  const isProd = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production'
  if (isProd) {
    throw new Error(
      `[FOUR PAWS FIREWALL] DEPLOY BLOCKED: Mock/demo module "${moduleName}" ` +
      `was imported in a production context. ` +
      `This module must not exist in the production bundle graph.`
    )
  }
}

/**
 * isMockAllowed — returns false in production, true in development.
 * Use as a feature gate anywhere mock data rendering is conditional.
 */
export function isMockAllowed() {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return false
  return true
}

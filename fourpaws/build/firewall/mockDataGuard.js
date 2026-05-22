#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — DEPLOYMENT FIREWALL
// mockDataGuard.js
//
// Pre-deploy validation gate. Runs BEFORE vite build.
// Scans the entire source graph for mock/demo/test data contamination.
// Any violation = EXIT 1 = deployment blocked immediately.
//
// Vercel: set Build Command to:
//   node build/firewall/mockDataGuard.js && vite build
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, resolve, relative } from 'path'

const ROOT    = resolve(process.cwd(), 'src')
const BLOCKED = process.env.NODE_ENV !== 'production' ? false : true  // only hard-block in production
const ENV     = process.env.NODE_ENV || 'development'

// ─────────────────────────────────────────────────────────────────────────────
// FORBIDDEN PATTERNS
// Any file whose path or exported symbols match these is considered contaminated.
// ─────────────────────────────────────────────────────────────────────────────
const FORBIDDEN_FILENAMES = [
  'mockData.js', 'mockData.ts', 'mockData.jsx', 'mockData.tsx',
  'seedData.js', 'seedData.ts',
  'testData.js', 'testData.ts',
  'demoData.js', 'demoData.ts',
  'fakeData.js', 'fakeData.ts',
  'devData.js',  'devData.ts',
  'fixtures.js', 'fixtures.ts',
]

const FORBIDDEN_DIRECTORIES = [
  '/dev/',
  '/test/',
  '/tests/',
  '/fixtures/',
  '/__mocks__/',
]

// Patterns found inside source files that indicate demo/mock contamination
const FORBIDDEN_IDENTIFIERS = [
  /\bDEMO_CLIENTS\b/,
  /\bDEMO_MESSAGES\b/,
  /\bDEMO_ANALYTICS\b/,
  /\bmockData\b/,
  /\bseedData\b/,
  /\btestData\b/,
  /\bdemoData\b/,
  /\bfakeData\b/,
  /\bdevData\b/,
  /\bFIXTURES\b/,
]

// Import patterns — catches dynamic and static imports of forbidden modules
const FORBIDDEN_IMPORT_PATTERNS = [
  /from\s+['"][^'"]*\/(mockData|seedData|testData|demoData|fakeData|devData|fixtures)['"]/,
  /require\s*\(\s*['"][^'"]*\/(mockData|seedData|testData|demoData|fakeData|devData|fixtures)['"]\s*\)/,
  /from\s+['"][^'"]*\/dev\//,
  /from\s+['"][^'"]*\/test\//,
  /from\s+['"][^'"]*\/__mocks__\//,
]

// ─────────────────────────────────────────────────────────────────────────────
// DATA FILE CLASSIFICATION
// Identifies which files are data files by path
// ─────────────────────────────────────────────────────────────────────────────
const DATA_FILE_PATTERNS = [
  /\/data\/clients\.js/,
  /\/data\/courses\.js/,
]

const DEMO_EXPORT_PATTERNS = [
  /export\s+(const|let|var)\s+DEMO_/,
  /export\s+(const|let|var)\s+MOCK_/,
  /export\s+(const|let|var)\s+SEED_/,
  /export\s+(const|let|var)\s+TEST_/,
  /export\s+(const|let|var)\s+FAKE_/,
]

// ─────────────────────────────────────────────────────────────────────────────
// FILE WALKER
// ─────────────────────────────────────────────────────────────────────────────
function walkDir(dir, files = []) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath, files)
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry)) {
      files.push(fullPath)
    }
  }
  return files
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATE PRODUCTION BUNDLE
// ─────────────────────────────────────────────────────────────────────────────
function validateProductionBundle() {
  const violations = []
  const allFiles   = walkDir(ROOT)

  for (const filePath of allFiles) {
    const rel     = relative(ROOT, filePath)
    const content = readFileSync(filePath, 'utf-8')
    const lines   = content.split('\n')

    // 1. Forbidden filename
    const filename = filePath.split('/').pop()
    if (FORBIDDEN_FILENAMES.includes(filename)) {
      violations.push({
        file: rel,
        line: 0,
        type: 'FORBIDDEN_FILE',
        detail: `File "${filename}" is a mock/test data file and must not exist in the production source tree.`,
      })
    }

    // 2. Forbidden directory
    for (const dir of FORBIDDEN_DIRECTORIES) {
      if (filePath.includes(dir)) {
        violations.push({
          file: rel,
          line: 0,
          type: 'FORBIDDEN_DIRECTORY',
          detail: `File resides in forbidden directory "${dir}". Mock/test data must not be in the production module graph.`,
        })
        break
      }
    }

    // 3. Forbidden import statements (line by line)
    lines.forEach((line, idx) => {
      for (const pattern of FORBIDDEN_IMPORT_PATTERNS) {
        if (pattern.test(line)) {
          violations.push({
            file: rel,
            line: idx + 1,
            type: 'FORBIDDEN_IMPORT',
            detail: `Forbidden import detected: ${line.trim()}`,
          })
        }
      }
    })

    // 4. DEMO_ / MOCK_ exports in data files that are imported by production modules
    if (DATA_FILE_PATTERNS.some(p => p.test(filePath))) {
      lines.forEach((line, idx) => {
        for (const pattern of DEMO_EXPORT_PATTERNS) {
          if (pattern.test(line)) {
            violations.push({
              file: rel,
              line: idx + 1,
              type: 'DEMO_EXPORT_IN_DATA_FILE',
              detail: `Data file exports mock/demo symbol: ${line.trim()}. Wrap in process.env.NODE_ENV check or move to /dev/.`,
            })
          }
        }
      })
    }

    // 5. Forbidden identifiers in core modules (non-data files)
    if (!DATA_FILE_PATTERNS.some(p => p.test(filePath))) {
      lines.forEach((line, idx) => {
        // Skip comment lines
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return
        for (const pattern of FORBIDDEN_IDENTIFIERS) {
          if (pattern.test(line)) {
            violations.push({
              file: rel,
              line: idx + 1,
              type: 'MOCK_IDENTIFIER_IN_PRODUCTION_MODULE',
              detail: `Mock/demo identifier found in production module: ${line.trim()}`,
            })
          }
        }
      })
    }
  }

  return violations
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT + EXIT
// ─────────────────────────────────────────────────────────────────────────────
function run() {
  const isProd = ENV === 'production' || process.argv.includes('--production') || process.argv.includes('--strict')
  const violations = validateProductionBundle()

  if (violations.length === 0) {
    console.log('\x1b[32m✔ FOUR PAWS DEPLOYMENT FIREWALL — CLEAN\x1b[0m')
    console.log('\x1b[32m  No mock, demo, or test data detected in production bundle graph.\x1b[0m')
    console.log('')
    process.exit(0)
  }

  // Violations found
  console.error('\n\x1b[31m╔══════════════════════════════════════════════════════════════╗\x1b[0m')
  console.error('\x1b[31m║  DEPLOY BLOCKED: MOCK DATA DETECTED IN PRODUCTION BUNDLE     ║\x1b[0m')
  console.error('\x1b[31m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n')

  violations.forEach((v, i) => {
    console.error(`\x1b[31m  [${i + 1}] ${v.type}\x1b[0m`)
    console.error(`\x1b[33m      File: src/${v.file}${v.line > 0 ? `:${v.line}` : ''}\x1b[0m`)
    console.error(`\x1b[37m      ${v.detail}\x1b[0m`)
    console.error('')
  })

  console.error('\x1b[31m  BLOCKED: MOCK DATA LEAK INTO PRODUCTION GRAPH\x1b[0m')
  console.error('\x1b[31m  Resolve all violations above before deploying.\x1b[0m\n')

  if (isProd) {
    process.exit(1)
  } else {
    // In dev mode: warn but don't block
    console.warn('\x1b[33m  ⚠ Running in development mode — firewall is advisory only.\x1b[0m')
    console.warn('\x1b[33m    Use --production or set NODE_ENV=production to enforce hard block.\x1b[0m\n')
    process.exit(0)
  }
}

run()

// ─────────────────────────────────────────────────────────────
// ACADEMY LICENSE ENGINE
// Offline-first PWA lock/unlock system.
// The Control Dashboard is the sole authority for issuing licenses.
// All logic runs locally in the browser — no backend required.
//
// Future-upgrade path:
//   Replace the storage adapter functions at the bottom of this
//   file with Supabase/Firebase equivalents — zero other changes.
// ─────────────────────────────────────────────────────────────

import { getOrCreateDeviceId } from './academyIdentity'

// ── Storage keys (namespaced, no collision with academyIdentity) ──
export const LICENSE_KEYS = {
  LICENSE:        'fp_academy_license',      // full license blob
  LOCK_STATE:     'fp_lock_state',           // 'locked' | 'unlocked' | 'suspended'
  ACTIVATION_LOG: 'fp_activation_log',       // audit trail
  PAIRING_HASH:   'fp_pairing_hash',         // integrity check value
}

// ── License status constants ──────────────────────────────────
export const LICENSE_STATUS = {
  LOCKED:    'locked',
  UNLOCKED:  'unlocked',
  SUSPENDED: 'suspended',
  EXPIRED:   'expired',
  CORRUPT:   'corrupt',
}

// ─────────────────────────────────────────────────────────────
// HASH — lightweight integrity check (FNV-1a, no crypto needed)
// Not cryptographic — just detects accidental data corruption.
// ─────────────────────────────────────────────────────────────
function fnv1a(str) {
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * 16777619) >>> 0
  }
  return hash.toString(16).toUpperCase()
}

function hashLicense(licenseData) {
  const payload = [
    licenseData.clientId,
    licenseData.academyId,
    licenseData.academyLinkCode,
    licenseData.deviceId,
    licenseData.activatedAt,
  ].join('|')
  return fnv1a(payload)
}

// ─────────────────────────────────────────────────────────────
// LICENSE STRUCTURE
// ─────────────────────────────────────────────────────────────
/**
 * academyLicense = {
 *   version:          number,
 *   clientId:         string,
 *   academyId:        string,
 *   academyLinkCode:  string,
 *   deviceId:         string,
 *   activatedAt:      ISO string,
 *   lastVerifiedAt:   ISO string,
 *   licenseStatus:    'locked'|'unlocked'|'suspended'|'expired'|'corrupt',
 *   activationHash:   string,       — FNV-1a integrity check
 *   pairingState:     object,       — device pairing metadata
 *   clientSnapshot:   object,       — name, email, enrolledCourses, etc.
 *   dogSnapshot:      object|null,  — dog profile at activation time
 * }
 */

// ─────────────────────────────────────────────────────────────
// STORAGE ADAPTER (swap for cloud adapter here when upgrading)
// ─────────────────────────────────────────────────────────────

function readLicense() {
  try {
    const raw = localStorage.getItem(LICENSE_KEYS.LICENSE)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeLicense(license) {
  try {
    localStorage.setItem(LICENSE_KEYS.LICENSE, JSON.stringify(license))
    localStorage.setItem(LICENSE_KEYS.LOCK_STATE, license.licenseStatus)
  } catch {}
}

function clearLicense() {
  localStorage.removeItem(LICENSE_KEYS.LICENSE)
  localStorage.removeItem(LICENSE_KEYS.LOCK_STATE)
  localStorage.removeItem(LICENSE_KEYS.PAIRING_HASH)
}

function appendActivationLog(entry) {
  try {
    const raw  = localStorage.getItem(LICENSE_KEYS.ACTIVATION_LOG)
    const log  = raw ? JSON.parse(raw) : []
    log.push({ ...entry, _ts: new Date().toISOString() })
    localStorage.setItem(LICENSE_KEYS.ACTIVATION_LOG, JSON.stringify(log.slice(-20)))
  } catch {}
}

// ─────────────────────────────────────────────────────────────
// ISSUE LICENSE — called after successful code validation
// ─────────────────────────────────────────────────────────────

/**
 * issueLicense(registryEntry, dogProfile?)
 * Writes a full license to local storage and returns it.
 */
export function issueLicense(registryEntry, dogProfile = null) {
  const deviceId    = getOrCreateDeviceId()
  const now         = new Date().toISOString()

  const licenseData = {
    version:         2,
    clientId:        registryEntry.clientId,
    academyId:       registryEntry.academyId,
    academyLinkCode: registryEntry.academyLinkCode,
    deviceId,
    activatedAt:     now,
    lastVerifiedAt:  now,
    licenseStatus:   LICENSE_STATUS.UNLOCKED,
    pairingState: {
      deviceId,
      pairedAt:       now,
      pairingVersion: 1,
      platform:       getPlatformInfo(),
    },
    clientSnapshot: {
      clientId:        registryEntry.clientId,
      name:            registryEntry.name,
      email:           registryEntry.email,
      enrolledCourses: registryEntry.enrolledCourses  || [],
      ownedAddons:     registryEntry.ownedAddons      || [],
      courseProgress:  registryEntry.courseProgress   || {},
      academyStatus:   LICENSE_STATUS.UNLOCKED,
    },
    dogSnapshot: dogProfile || null,
  }

  licenseData.activationHash = hashLicense(licenseData)

  writeLicense(licenseData)
  localStorage.setItem(LICENSE_KEYS.PAIRING_HASH, licenseData.activationHash)

  appendActivationLog({
    event:       'ACTIVATED',
    clientId:    licenseData.clientId,
    academyId:   licenseData.academyId,
    deviceId,
    linkCode:    licenseData.academyLinkCode,
  })

  return licenseData
}

// ─────────────────────────────────────────────────────────────
// VERIFY LICENSE — called on every app startup
// ─────────────────────────────────────────────────────────────

/**
 * verifyLicense() → { valid: bool, status: LICENSE_STATUS, license: obj|null, reason: string }
 *
 * Checks:
 *   1. License exists
 *   2. Hash integrity
 *   3. Device ID matches this browser
 *   4. Status is UNLOCKED
 */
export function verifyLicense() {
  const license = readLicense()

  if (!license) {
    return { valid: false, status: LICENSE_STATUS.LOCKED, license: null, reason: 'No license found.' }
  }

  // Integrity check
  const expectedHash = hashLicense(license)
  if (license.activationHash !== expectedHash) {
    // License data has been tampered with or corrupted
    revokeLicense('CORRUPT_HASH')
    return { valid: false, status: LICENSE_STATUS.CORRUPT, license: null, reason: 'License integrity check failed.' }
  }

  // Status check
  if (license.licenseStatus === LICENSE_STATUS.SUSPENDED) {
    return { valid: false, status: LICENSE_STATUS.SUSPENDED, license, reason: 'Academy access has been suspended.' }
  }
  if (license.licenseStatus === LICENSE_STATUS.EXPIRED) {
    return { valid: false, status: LICENSE_STATUS.EXPIRED, license, reason: 'Academy access has expired.' }
  }
  if (license.licenseStatus !== LICENSE_STATUS.UNLOCKED) {
    return { valid: false, status: license.licenseStatus, license, reason: 'Academy is locked.' }
  }

  // Device binding check
  const currentDeviceId = getOrCreateDeviceId()
  if (license.deviceId !== currentDeviceId) {
    // Different browser/device — treat as locked (not corrupt, just needs re-activation)
    return { valid: false, status: LICENSE_STATUS.LOCKED, license: null, reason: 'Device mismatch. Please re-activate.' }
  }

  // All checks passed — refresh verification timestamp
  license.lastVerifiedAt = new Date().toISOString()
  writeLicense(license)

  return { valid: true, status: LICENSE_STATUS.UNLOCKED, license, reason: null }
}

// ─────────────────────────────────────────────────────────────
// REVOKE LICENSE — called by admin suspend or corruption
// ─────────────────────────────────────────────────────────────

export function revokeLicense(reason = 'ADMIN_REVOKE') {
  const license = readLicense()
  if (license) {
    license.licenseStatus   = LICENSE_STATUS.SUSPENDED
    license.revokedAt       = new Date().toISOString()
    license.revokeReason    = reason
    writeLicense(license)
    appendActivationLog({ event: 'REVOKED', reason, deviceId: license.deviceId })
  }
}

// ─────────────────────────────────────────────────────────────
// FULL RESET — used on logout or "forget this device"
// ─────────────────────────────────────────────────────────────

export function resetLicense() {
  const license = readLicense()
  appendActivationLog({
    event:    'RESET',
    clientId: license?.clientId,
    deviceId: license?.deviceId,
  })
  clearLicense()
}

// ─────────────────────────────────────────────────────────────
// PATCH LICENSE — update client/dog snapshot after onboarding
// ─────────────────────────────────────────────────────────────

export function patchLicense(patch) {
  const license = readLicense()
  if (!license) return null
  const updated = { ...license, ...patch, lastVerifiedAt: new Date().toISOString() }
  // Recompute hash only if core identity fields changed
  if (patch.clientId || patch.academyId || patch.academyLinkCode || patch.deviceId || patch.activatedAt) {
    updated.activationHash = hashLicense(updated)
  }
  writeLicense(updated)
  return updated
}

/**
 * Update the dog snapshot inside the license (after onboarding).
 */
export function saveDogToLicense(dogProfile) {
  return patchLicense({ dogSnapshot: dogProfile })
}

/**
 * Update enrolled courses / addons inside the license snapshot.
 */
export function syncClientSnapshotToLicense(snapshot) {
  const license = readLicense()
  if (!license) return null
  const updated = {
    ...license,
    clientSnapshot: { ...license.clientSnapshot, ...snapshot },
    lastVerifiedAt: new Date().toISOString(),
  }
  writeLicense(updated)
  return updated
}

// ─────────────────────────────────────────────────────────────
// SUSPEND FROM DASHBOARD — admin-side action
// Updates the registry AND patches the local license (if same device)
// ─────────────────────────────────────────────────────────────

export function suspendLicenseForClient(linkCode) {
  const license = readLicense()
  if (license?.academyLinkCode === linkCode) {
    revokeLicense('ADMIN_SUSPEND')
  }
  // Also update lock state key so the gate reads it immediately
  localStorage.setItem(LICENSE_KEYS.LOCK_STATE, LICENSE_STATUS.SUSPENDED)
}

// ─────────────────────────────────────────────────────────────
// QUICK READ — lock state without full verification
// ─────────────────────────────────────────────────────────────

export function getLockState() {
  return localStorage.getItem(LICENSE_KEYS.LOCK_STATE) || LICENSE_STATUS.LOCKED
}

export function isLicensed() {
  return getLockState() === LICENSE_STATUS.UNLOCKED
}

export function loadLicense() {
  return readLicense()
}

export function getActivationLog() {
  try {
    return JSON.parse(localStorage.getItem(LICENSE_KEYS.ACTIVATION_LOG) || '[]')
  } catch { return [] }
}

// ─────────────────────────────────────────────────────────────
// PLATFORM INFO — stored in pairing metadata
// ─────────────────────────────────────────────────────────────

function getPlatformInfo() {
  try {
    return {
      userAgent:  navigator.userAgent.slice(0, 80),
      language:   navigator.language,
      platform:   navigator.platform || 'unknown',
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      screenW:    window.screen.width,
      screenH:    window.screen.height,
    }
  } catch {
    return { platform: 'unknown' }
  }
}

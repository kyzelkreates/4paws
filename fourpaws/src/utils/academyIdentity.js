// ─────────────────────────────────────────────────────────────
// ACADEMY IDENTITY SYSTEM
// Single Source of Truth for all linking, device, and session logic.
// Future-compatible: swap localStorage calls for Supabase/Firebase
// by replacing the storage adapter below — zero other rewrites needed.
// ─────────────────────────────────────────────────────────────

// ── Storage keys ─────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACADEMY_REGISTRY:  'fp_academy_registry',   // master code → client mapping (admin-side)
  DEVICE_IDENTITY:   'fp_device_identity',    // this device's linked identity
  DEVICE_SESSION:    'fp_device_session',     // active session state for this device
  CLIENT_IDENTITY:   'fp_client_identity',    // client's own persisted identity blob
}

// ── Tier vocabulary for premium code generation ───────────────
const TIERS   = ['ELITE', 'LUXE', 'GOLD', 'NOIR', 'CREST', 'APEX', 'AURA', 'VEIL']
const PREFIX  = 'FPA'

// ─────────────────────────────────────────────────────────────
// CODE GENERATOR
// Produces codes like: FPA-ELITE-4837
// Collision-checked against the live registry.
// ─────────────────────────────────────────────────────────────
export function generateAcademyLinkCode() {
  const registry = loadRegistry()
  const existing = new Set(Object.keys(registry))
  let code
  let attempts = 0
  do {
    const tier   = TIERS[Math.floor(Math.random() * TIERS.length)]
    const digits = String(Math.floor(1000 + Math.random() * 9000))
    code = `${PREFIX}-${tier}-${digits}`
    attempts++
    if (attempts > 500) break // safety valve
  } while (existing.has(code))
  return code
}

// ─────────────────────────────────────────────────────────────
// ACADEMY ID — short human-friendly unique identifier
// e.g.  "ACM-7F3A"
// ─────────────────────────────────────────────────────────────
export function generateAcademyId() {
  const hex = Math.random().toString(16).slice(2, 6).toUpperCase()
  return `ACM-${hex}`
}

// ─────────────────────────────────────────────────────────────
// DEVICE ID — persistent per-browser fingerprint
// ─────────────────────────────────────────────────────────────
export function getOrCreateDeviceId() {
  const key = 'fp_device_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = 'DEV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    localStorage.setItem(key, id)
  }
  return id
}

// ─────────────────────────────────────────────────────────────
// REGISTRY — maps linkCode → client record (admin-side SSOT)
// ─────────────────────────────────────────────────────────────
export function loadRegistry() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACADEMY_REGISTRY) || '{}')
  } catch { return {} }
}

export function saveRegistry(registry) {
  localStorage.setItem(STORAGE_KEYS.ACADEMY_REGISTRY, JSON.stringify(registry))
}

/**
 * Register a new client identity in the registry.
 * Called when the admin creates or updates a client.
 */
export function registerClientInRegistry(client) {
  const registry = loadRegistry()
  registry[client.academyLinkCode] = {
    clientId:            client.id,
    academyId:           client.academyId,
    academyLinkCode:     client.academyLinkCode,
    academyActivationKey: client.academyActivationKey,
    name:                client.name,
    email:               client.email,
    enrolledCourses:     client.enrolledCourses   || [],
    ownedAddons:         client.ownedAddons        || [],
    courseProgress:      client.courseProgress     || {},
    academyStatus:       client.academyStatus      || 'pending',
    linkedDevices:       client.linkedDevices      || [],
    lastActivity:        client.lastActivity       || null,
    registeredAt:        client.registeredAt       || new Date().toISOString(),
  }
  saveRegistry(registry)
}

/**
 * Bulk-seed the registry from the DEMO_CLIENTS array.
 * Idempotent — skips clients that already have an entry.
 */
export function seedRegistryFromClients(clients) {
  const registry = loadRegistry()
  let changed = false
  clients.forEach(c => {
    if (c.academyLinkCode && !registry[c.academyLinkCode]) {
      registry[c.academyLinkCode] = {
        clientId:            c.id,
        academyId:           c.academyId,
        academyLinkCode:     c.academyLinkCode,
        academyActivationKey: c.academyActivationKey,
        name:                c.name,
        email:               c.email,
        enrolledCourses:     c.enrolledCourses   || [],
        ownedAddons:         c.ownedAddons        || [],
        courseProgress:      c.courseProgress     || {},
        academyStatus:       c.academyStatus      || 'pending',
        linkedDevices:       c.linkedDevices      || [],
        lastActivity:        c.lastActivity       || null,
        registeredAt:        c.registeredAt       || new Date().toISOString(),
      }
      changed = true
    }
  })
  if (changed) saveRegistry(registry)
}

/**
 * Look up a client record by their link code.
 * Returns null if not found.
 */
export function lookupByLinkCode(code) {
  if (!code) return null
  const registry = loadRegistry()
  return registry[code.trim().toUpperCase()] || null
}

/**
 * Update a registry entry in place (e.g. after progress sync).
 */
export function patchRegistryEntry(linkCode, patch) {
  const registry = loadRegistry()
  if (!registry[linkCode]) return
  registry[linkCode] = { ...registry[linkCode], ...patch }
  saveRegistry(registry)
}

// ─────────────────────────────────────────────────────────────
// DEVICE LINKING
// ─────────────────────────────────────────────────────────────

/**
 * Link this device to a client profile.
 * Stores the identity locally so the PWA can auto-restore sessions.
 */
export function linkDeviceToClient(registryEntry) {
  const deviceId = getOrCreateDeviceId()
  const linkedAt = new Date().toISOString()

  // Persist device identity
  const deviceIdentity = {
    deviceId,
    linkedAt,
    clientId:        registryEntry.clientId,
    academyId:       registryEntry.academyId,
    academyLinkCode: registryEntry.academyLinkCode,
    name:            registryEntry.name,
    email:           registryEntry.email,
  }
  localStorage.setItem(STORAGE_KEYS.DEVICE_IDENTITY, JSON.stringify(deviceIdentity))

  // Persist client identity (full profile snapshot for offline use)
  const clientIdentity = {
    ...registryEntry,
    deviceId,
    linkedAt,
    lastSyncedAt: linkedAt,
  }
  localStorage.setItem(STORAGE_KEYS.CLIENT_IDENTITY, JSON.stringify(clientIdentity))

  // Record this device in the registry
  const registry = loadRegistry()
  const entry    = registry[registryEntry.academyLinkCode]
  if (entry) {
    const already = entry.linkedDevices.find(d => d.deviceId === deviceId)
    if (!already) {
      entry.linkedDevices = [...(entry.linkedDevices || []), { deviceId, linkedAt }]
    } else {
      already.linkedAt = linkedAt // refresh timestamp
    }
    entry.academyStatus = 'active'
    entry.lastActivity  = linkedAt
    saveRegistry(registry)
  }

  return deviceIdentity
}

/**
 * Check whether this device is already linked to an academy profile.
 * Returns the stored identity or null.
 */
export function getLinkedDeviceIdentity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEVICE_IDENTITY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

/**
 * Load the full client identity stored on this device.
 */
export function getClientIdentity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_IDENTITY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

/**
 * Sync local progress back into the registry entry and client identity.
 * Call this whenever a lesson is completed.
 */
export function syncProgressToRegistry(linkCode, courseProgress) {
  patchRegistryEntry(linkCode, {
    courseProgress,
    lastActivity: new Date().toISOString(),
  })
  // Also update the device-local client identity
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_IDENTITY)
    if (raw) {
      const identity = JSON.parse(raw)
      identity.courseProgress = courseProgress
      identity.lastSyncedAt   = new Date().toISOString()
      localStorage.setItem(STORAGE_KEYS.CLIENT_IDENTITY, JSON.stringify(identity))
    }
  } catch {}
}

/**
 * Unlink this device (logout / reset).
 * Does NOT delete the registry entry — just clears local device identity.
 */
export function unlinkDevice() {
  localStorage.removeItem(STORAGE_KEYS.DEVICE_IDENTITY)
  localStorage.removeItem(STORAGE_KEYS.CLIENT_IDENTITY)
}

// ─────────────────────────────────────────────────────────────
// VALIDATION HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Validate an entered activation code.
 * Returns { valid: bool, entry: registryEntry | null, error: string | null }
 */
export function validateActivationCode(rawCode) {
  const code = rawCode.trim().toUpperCase()

  // Format check  FPA-XXXX-DDDD
  if (!/^FPA-[A-Z]+-\d{4}$/.test(code)) {
    return { valid: false, entry: null, error: 'Invalid code format. Codes look like FPA-ELITE-4837.' }
  }

  const entry = lookupByLinkCode(code)
  if (!entry) {
    return { valid: false, entry: null, error: 'Code not recognised. Please check your invitation and try again.' }
  }

  if (entry.academyStatus === 'suspended') {
    return { valid: false, entry: null, error: 'This academy access has been suspended. Please contact the academy.' }
  }

  // Duplicate device protection — warn if already linked elsewhere
  const deviceId  = getOrCreateDeviceId()
  const duplicate = entry.linkedDevices?.find(d => d.deviceId !== deviceId)
  // (we allow it but flag it — admin can see linked devices)

  return { valid: true, entry, error: null, alreadyLinked: !!duplicate }
}

/**
 * Build a full client user object from a registry entry,
 * suitable for injecting into AppContext as currentUser.
 */
export function buildClientUserFromEntry(entry) {
  return {
    id:              entry.clientId,
    academyId:       entry.academyId,
    academyLinkCode: entry.academyLinkCode,
    name:            entry.name,
    email:           entry.email,
    role:            'client',
    academyStatus:   entry.academyStatus,
    enrolledCourses: entry.enrolledCourses  || [],
    ownedAddons:     entry.ownedAddons      || [],
    courseProgress:  entry.courseProgress   || {},
    linkedDevices:   entry.linkedDevices    || [],
    linkedAt:        entry.linkedAt         || null,
  }
}

// ─────────────────────────────────────────────────────────────
// ACADEMY STATUS LABELS
// ─────────────────────────────────────────────────────────────
export const ACADEMY_STATUS = {
  PENDING:   'pending',    // code generated, not yet activated
  ACTIVE:    'active',     // device linked and in use
  SUSPENDED: 'suspended',  // manually suspended by admin
}

export function academyStatusLabel(status) {
  switch (status) {
    case ACADEMY_STATUS.ACTIVE:    return { label: 'Active',    colour: 'text-emerald-400', dot: 'bg-emerald-400' }
    case ACADEMY_STATUS.SUSPENDED: return { label: 'Suspended', colour: 'text-red-400',     dot: 'bg-red-400'     }
    default:                       return { label: 'Pending',   colour: 'text-amber-400',   dot: 'bg-amber-400'   }
  }
}

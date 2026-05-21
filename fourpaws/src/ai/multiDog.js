// ─────────────────────────────────────────────────────────────
// FOUR PAWS — MULTI-DOG HOUSEHOLD SYSTEM
// Offline-first. Each dog has an independent profile and AI
// analysis. All stored under the same license.
// ─────────────────────────────────────────────────────────────

const MULTI_DOG_KEY = 'fp_multi_dog_profiles'

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
export function loadDogProfiles() {
  try {
    const raw = localStorage.getItem(MULTI_DOG_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveDogProfiles(profiles) {
  try {
    localStorage.setItem(MULTI_DOG_KEY, JSON.stringify(profiles))
  } catch {}
}

export function addDogProfile(dogProfile) {
  const profiles = loadDogProfiles()
  const id       = 'dog-' + Date.now().toString(36)
  const newDog   = { ...dogProfile, id, addedAt: new Date().toISOString() }
  profiles.push(newDog)
  saveDogProfiles(profiles)
  return newDog
}

export function updateDogProfile(dogId, patch) {
  const profiles = loadDogProfiles()
  const idx      = profiles.findIndex(d => d.id === dogId)
  if (idx === -1) return null
  profiles[idx]  = { ...profiles[idx], ...patch, updatedAt: new Date().toISOString() }
  saveDogProfiles(profiles)
  return profiles[idx]
}

export function removeDogProfile(dogId) {
  const profiles = loadDogProfiles().filter(d => d.id !== dogId)
  saveDogProfiles(profiles)
}

export function getActiveDogId() {
  return localStorage.getItem('fp_active_dog_id') || null
}

export function setActiveDogId(id) {
  localStorage.setItem('fp_active_dog_id', id)
}

// ─────────────────────────────────────────────────────────────
// HOUSEHOLD RELATIONSHIP INSIGHTS
// ─────────────────────────────────────────────────────────────
export function getHouseholdInsight(dogs) {
  if (!dogs || dogs.length < 2) return null

  const highAnxiety  = dogs.filter(d => (d.anxiety  || 0) > 6).map(d => d.name)
  const highEnergy   = dogs.filter(d => (d.energy   || 0) > 7).map(d => d.name)
  const highReactive = dogs.filter(d => (d.reactivity || 0) > 6).map(d => d.name)

  const insights = []

  if (highAnxiety.length > 1) {
    insights.push(`Multiple dogs in your household exhibit elevated anxiety. Avoiding shared arousal spirals between ${highAnxiety.join(' and ')} is essential — manage introductions to stimuli independently.`)
  }
  if (highEnergy.length >= 2) {
    insights.push(`${highEnergy.join(' and ')} share high energy profiles. Parallel physical exercise before group enrichment reduces competitive tension.`)
  }
  if (highReactive.length > 0 && dogs.length >= 2) {
    insights.push(`${highReactive[0]} exhibits reactivity which can be amplified by the presence of other household dogs. Solo training sessions are recommended for threshold work.`)
  }
  if (dogs.length >= 3) {
    insights.push(`Multi-dog households of three or more benefit significantly from individual daily sessions alongside group time. One-on-one connection builds the relationship that makes group harmony possible.`)
  }

  if (insights.length === 0) {
    insights.push(`Your multi-dog household shows a complementary profile. Structured group enrichment alongside individual training sessions will maintain harmony and individual progress.`)
  }

  return insights
}

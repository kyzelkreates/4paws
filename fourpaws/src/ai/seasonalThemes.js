// ─────────────────────────────────────────────────────────────────────────────
// FOUR PAWS — DYNAMIC SEASONAL EXPERIENCE ENGINE
// Generates season-aware ambience, colours, and narrative tone.
// Fully offline. Updates automatically based on device date.
// ─────────────────────────────────────────────────────────────────────────────

const SEASON_KEY = 'fp_seasonal_theme'

// ─────────────────────────────────────────────────────────────────────────────
// SEASON DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
export const SEASONS = {
  spring: {
    id: 'spring', name: 'Spring', emoji: '🌸',
    months: [2, 3, 4],
    // CSS colour tokens
    primary:    '#C9A84C',
    secondary:  '#A8D5A2',
    accent:     '#F0E68C',
    bg:         'rgba(168, 213, 162, 0.03)',
    glow:       'rgba(168, 213, 162, 0.06)',
    gradient:   'radial-gradient(ellipse 60% 60% at 30% 20%, rgba(168,213,162,0.05) 0%, transparent 70%)',

    // Narrative
    ambience:       'A fresh spring morning — ideal conditions for new learning.',
    trainingNote:   'Spring energy supports new behaviour introduction. Use the natural environmental novelty as a controlled exposure tool.',
    enrichmentNote: 'Garden exploration, novel scent trails, and spring soundscape exposure provide rich sensory enrichment.',

    // Ambient animation config
    particles: { colour: 'rgba(168,213,162,0.15)', count: 6, size: 3 },
  },

  summer: {
    id: 'summer', name: 'Summer', emoji: '☀️',
    months: [5, 6, 7],
    primary:    '#C9A84C',
    secondary:  '#FFB347',
    accent:     '#FFEAA7',
    bg:         'rgba(255, 179, 71, 0.03)',
    glow:       'rgba(255, 179, 71, 0.07)',
    gradient:   'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,200,80,0.06) 0%, transparent 70%)',

    ambience:       'Summer warmth — schedule intensive sessions for early morning or evening.',
    trainingNote:   'In summer heat, reduce training duration and increase rest periods. Frozen enrichment supports calm regulation.',
    enrichmentNote: 'Water-based play, frozen lickimats, and shaded sniff gardens are summer-optimal enrichment choices.',

    particles: { colour: 'rgba(255,200,80,0.12)', count: 8, size: 2 },
  },

  autumn: {
    id: 'autumn', name: 'Autumn', emoji: '🍂',
    months: [8, 9, 10],
    primary:    '#C9A84C',
    secondary:  '#CD7F32',
    accent:     '#E8B86D',
    bg:         'rgba(205, 127, 50, 0.03)',
    glow:       'rgba(205, 127, 50, 0.07)',
    gradient:   'radial-gradient(ellipse 60% 60% at 70% 30%, rgba(205,127,50,0.05) 0%, transparent 70%)',

    ambience:       'Autumn — the season of consolidation. What has been planted is now deepening.',
    trainingNote:   'Autumn\'s crisp conditions support longer, more focused training sessions. Use seasonal scents — fallen leaves, earth — as controlled novel exposures.',
    enrichmentNote: 'Foraging through autumn leaves, scent trails in fallen foliage, and hearth-side calm sessions are seasonally aligned.',

    particles: { colour: 'rgba(205,127,50,0.12)', count: 5, size: 3 },
  },

  winter: {
    id: 'winter', name: 'Winter', emoji: '❄️',
    months: [11, 0, 1],
    primary:    '#C9A84C',
    secondary:  '#B8C8FF',
    accent:     '#E8F0FE',
    bg:         'rgba(184, 200, 255, 0.02)',
    glow:       'rgba(184, 200, 255, 0.05)',
    gradient:   'radial-gradient(ellipse 60% 60% at 20% 80%, rgba(184,200,255,0.04) 0%, transparent 70%)',

    ambience:       'Winter — a quieter season for calm consolidation and indoor deepening.',
    trainingNote:   'Winter is ideal for indoor precision work and calm-state training. Shorter, higher-quality sessions outperform longer, distracted ones.',
    enrichmentNote: 'Indoor scent work, puzzle feeding, massage, and calm companionship are winter-perfect enrichment choices.',

    particles: { colour: 'rgba(200,220,255,0.10)', count: 12, size: 1.5 },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// GET CURRENT SEASON
// ─────────────────────────────────────────────────────────────────────────────
export function getCurrentSeason() {
  const month = new Date().getMonth()
  return Object.values(SEASONS).find(s => s.months.includes(month)) || SEASONS.autumn
}

export function loadSeasonalTheme() {
  const season = getCurrentSeason()
  try {
    const saved = JSON.parse(localStorage.getItem(SEASON_KEY) || 'null')
    // Refresh daily
    if (saved?.id === season.id && saved?.date === new Date().toDateString()) return saved
  } catch {}
  const theme = { ...season, date: new Date().toDateString() }
  localStorage.setItem(SEASON_KEY, JSON.stringify(theme))
  return theme
}

// ─────────────────────────────────────────────────────────────────────────────
// SEASONAL CSS INJECTION
// Injects season-aware custom properties into :root
// ─────────────────────────────────────────────────────────────────────────────
export function injectSeasonalTheme(season) {
  const root = document.documentElement
  root.style.setProperty('--season-primary',   season.primary)
  root.style.setProperty('--season-secondary', season.secondary)
  root.style.setProperty('--season-accent',    season.accent)
  root.style.setProperty('--season-bg',        season.bg)
  root.style.setProperty('--season-glow',      season.glow)
}

// ─────────────────────────────────────────────────────────────────────────────
// SEASONAL NARRATIVE
// ─────────────────────────────────────────────────────────────────────────────
export function getSeasonalNarrative(dogName, season) {
  const dog = dogName || 'your companion'
  const map = {
    spring: `${dog}'s programme enters this spring with momentum. The conditions are ideal for gentle environmental expansion.`,
    summer: `Summer brings extended daylight and natural energy for ${dog}. Manage arousal carefully and prioritise early morning sessions.`,
    autumn: `Autumn provides ideal training conditions for ${dog}. The cooler air, reduced distractions, and natural calm of the season support deep consolidation.`,
    winter: `Winter is a season of quiet deepening for ${dog}. The focused indoor work of this period builds the foundations that express themselves in spring.`,
  }
  return map[season.id] || map.autumn
}

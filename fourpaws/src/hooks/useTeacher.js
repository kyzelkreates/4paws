// ─────────────────────────────────────────────────────────────────────────────
// useTeacher — AI Teacher state hook
// Single hook consumed by both AcademyLayout and AdminLayout.
// Manages guidance visibility, memory, and skip/resume logic.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  loadTeacherState, saveTeacherState, resetTeacherState,
  getGuidanceForPath, detectConfusion, markNodeSeen, markNodeCompleted,
  skipNode, skipSurface, setTeacherMode, recordPathVisit, enableTeacher,
  getResumableGuidance, getCompletedGuidance, getTeacherProgress,
} from '../ai/aiTeacher'

export function useTeacher(surface = 'pwa') {
  const location = useLocation()
  const [teacherState, setTeacherState] = useState(() => loadTeacherState())
  const [activeNode,   setActiveNode]   = useState(null)
  const [helpOpen,     setHelpOpen]     = useState(false)

  // ── On route change: determine if guidance should appear ──
  useEffect(() => {
    const path   = location.pathname
    const next   = recordPathVisit(path, teacherState)
    setTeacherState(next)

    // Don't show if help drawer is open or a node is already visible
    if (helpOpen) return

    // Primary: first-visit guidance
    const primaryNode = getGuidanceForPath(path, surface, next)
    if (primaryNode) {
      // Small delay — let the page render first, then softly appear
      const t = setTimeout(() => {
        const marked = markNodeSeen(primaryNode.id, loadTeacherState())
        setTeacherState(marked)
        setActiveNode(primaryNode)
      }, 900)
      return () => clearTimeout(t)
    }

    // Secondary: confusion detection
    const confusionNode = detectConfusion(path, next)
    if (confusionNode) {
      const t = setTimeout(() => setActiveNode(confusionNode), 1800)
      return () => clearTimeout(t)
    }

    // Otherwise — remain silent
    setActiveNode(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // ── Actions ────────────────────────────────────────────────
  const handleComplete = useCallback(() => {
    if (!activeNode) return
    const next = markNodeCompleted(activeNode.id, teacherState)
    setTeacherState(next)
    setActiveNode(null)
  }, [activeNode, teacherState])

  const handleSkip = useCallback(() => {
    if (!activeNode) return
    const next = skipNode(activeNode.id, teacherState)
    setTeacherState(next)
    setActiveNode(null)
  }, [activeNode, teacherState])

  const handleSkipAll = useCallback(() => {
    const next = skipSurface(surface, teacherState)
    setTeacherState(next)
    setActiveNode(null)
    setHelpOpen(false)
  }, [surface, teacherState])

  const handleResumeNode = useCallback((node) => {
    setHelpOpen(false)
    setActiveNode(node)
  }, [])

  const handleReset = useCallback(() => {
    const next = resetTeacherState()
    setTeacherState(next)
    setActiveNode(null)
    setHelpOpen(false)
  }, [])

  const handleOpenHelp = useCallback(() => {
    setActiveNode(null)
    setHelpOpen(true)
  }, [])

  const handleCloseHelp = useCallback(() => setHelpOpen(false), [])

  // ── Derived data for HelpCentre ────────────────────────────
  const resumable = getResumableGuidance(surface, teacherState)
  const completed = getCompletedGuidance(surface, teacherState)
  const progress  = getTeacherProgress(surface, teacherState)

  return {
    activeNode,
    helpOpen,
    teacherEnabled: teacherState.teacherEnabled,
    mode:           teacherState.mode,
    resumable,
    completed,
    progress,
    handleComplete,
    handleSkip,
    handleSkipAll,
    handleResumeNode,
    handleReset,
    handleOpenHelp,
    handleCloseHelp,
  }
}

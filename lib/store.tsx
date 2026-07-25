"use client"

import * as React from "react"
import { MODULES, SIMULATION_IDS } from "./curriculum"
import type {
  AppState,
  Candidate,
  ModuleProgress,
  ReviewItem,
  SimulationState,
} from "./types"

const STORAGE_KEY = "ascend:v1"

function buildInitialModuleProgress(): Record<string, ModuleProgress> {
  const progress: Record<string, ModuleProgress> = {}
  for (const mod of MODULES) {
    progress[mod.id] = {
      status: mod.prerequisiteId === null ? "available" : "locked",
      diagnosticScore: null,
      diagnosticDone: false,
      theoryRead: false,
      drillsPassed: false,
      examScore: null,
      attempts: 0,
      mastered: false,
    }
  }
  return progress
}

function buildInitialSimulations(): Record<string, SimulationState> {
  const sims: Record<string, SimulationState> = {}
  SIMULATION_IDS.forEach((id, index) => {
    sims[id] = {
      id,
      unlocked: index === 0,
      completed: false,
      bestScore: null,
    }
  })
  return sims
}

function initialState(): AppState & { profileData?: any } {
  let savedLang: "pt" | "es" | "en" = "pt"
  if (typeof window !== "undefined") {
    const storedLang = localStorage.getItem("app_language") as "pt" | "es" | "en"
    if (storedLang) savedLang = storedLang
  }

  let savedProfile = null
  if (typeof window !== "undefined") {
    try {
      const rawProfile = localStorage.getItem("user_profile_analysis")
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile)
        savedProfile = parsed?.profile || parsed
      }
    } catch {
      // ignore
    }
  }

  return {
    onboardingStep: 0,
    candidate: null,
    selectedContestId: null,
    onboardingComplete: false,
    moduleProgress: buildInitialModuleProgress(),
    simulations: buildInitialSimulations(),
    reviewQueue: [],
    activeView: "onboarding",
    activeModuleId: null,
    language: savedLang,
    profileData: savedProfile,
  }
}

interface StoreContextValue {
  state: AppState & { profileData?: any }
  hydrated: boolean
  setOnboardingStep: (step: number) => void
  setCandidate: (candidate: Candidate) => void
  selectContest: (id: string) => void
  completeOnboarding: () => void
  setActiveView: (view: AppState["activeView"]) => void
  openModule: (moduleId: string) => void
  recordDiagnostic: (moduleId: string, score: number) => void
  markTheoryRead: (moduleId: string) => void
  markDrillsPassed: (moduleId: string) => void
  recordExam: (moduleId: string, score: number) => void
  masterModule: (moduleId: string) => void
  addReviewItems: (items: ReviewItem[]) => void
  removeReviewItem: (questionId: string) => void
  completeSimulation: (id: string, score: number) => void
  resetProgress: () => void
  setLanguage: (lang: "pt" | "es" | "en") => void
  setProfileData: (data: any) => void
  overallMastery: number
  masteredCount: number
  isModuleUnlocked: (moduleId: string) => boolean
  moduleMastery: (moduleId: string) => number
  navigate: (target: { view: AppState["activeView"]; moduleId?: string }) => void
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AppState & { profileData?: any }>(initialState)
  const [hydrated, setHydrated] = React.useState(false)
  const isWriting = React.useRef(false)

  // Hydrate from localStorage on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        const merged = { ...initialState(), ...parsed }
        if (merged.language) {
          localStorage.setItem("app_language", merged.language)
        }
        setState(merged)
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  // Persist on every change after hydration.
  React.useEffect(() => {
    if (!hydrated) return
    try {
      isWriting.current = true
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated])

  // Cross-tab sync: react to storage events from other tabs.
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "app_language" && e.newValue) {
        setState((s) => ({ ...s, language: e.newValue as AppState["language"] }))
        return
      }
      if (e.key !== STORAGE_KEY || e.newValue === null) return
      try {
        const parsed = JSON.parse(e.newValue) as AppState
        const merged = { ...initialState(), ...parsed }
        if (merged.language) {
          localStorage.setItem("app_language", merged.language)
        }
        setState(merged)
      } catch {
        // ignore
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const setOnboardingStep = React.useCallback((step: number) => {
    setState((s) => ({ ...s, onboardingStep: step }))
  }, [])

  const setCandidate = React.useCallback((candidate: Candidate) => {
    setState((s) => ({ ...s, candidate }))
  }, [])

  const selectContest = React.useCallback((id: string) => {
    setState((s) => ({ ...s, selectedContestId: id }))
  }, [])

  const setProfileData = React.useCallback((data: any) => {
    setState((s) => ({ ...s, profileData: data }))
  }, [])

  const completeOnboarding = React.useCallback(() => {
    setState((s) => {
      const nextState = {
        ...s,
        onboardingComplete: true,
        activeView: "dashboard" as const,
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
      } catch {
        // ignora erros de cota
      }
      return nextState
    })
  }, [])

  const setActiveView = React.useCallback((view: AppState["activeView"]) => {
    setState((s) => ({ ...s, activeView: view, activeModuleId: view === "module" ? s.activeModuleId : null }))
  }, [])

  const openModule = React.useCallback((moduleId: string) => {
    setState((s) => {
      const mp = s.moduleProgress[moduleId]
      if (!mp || mp.status === "locked") return s
      return {
        ...s,
        activeView: "module",
        activeModuleId: moduleId,
        moduleProgress: {
          ...s.moduleProgress,
          [moduleId]: {
            ...mp,
            status: mp.status === "available" ? "in-progress" : mp.status,
          },
        },
      }
    })
  }, [])

  const recordDiagnostic = React.useCallback((moduleId: string, score: number) => {
    setState((s) => ({
      ...s,
      moduleProgress: {
        ...s.moduleProgress,
        [moduleId]: {
          ...s.moduleProgress[moduleId],
          diagnosticScore: score,
          diagnosticDone: true,
          status: "in-progress",
        },
      },
    }))
  }, [])

  const markTheoryRead = React.useCallback((moduleId: string) => {
    setState((s) => ({
      ...s,
      moduleProgress: {
        ...s.moduleProgress,
        [moduleId]: { ...s.moduleProgress[moduleId], theoryRead: true },
      },
    }))
  }, [])

  const markDrillsPassed = React.useCallback((moduleId: string) => {
    setState((s) => ({
      ...s,
      moduleProgress: {
        ...s.moduleProgress,
        [moduleId]: { ...s.moduleProgress[moduleId], drillsPassed: true },
      },
    }))
  }, [])

  const recordExam = React.useCallback((moduleId: string, score: number) => {
    setState((s) => ({
      ...s,
      moduleProgress: {
        ...s.moduleProgress,
        [moduleId]: {
          ...s.moduleProgress[moduleId],
          examScore: score,
          attempts: s.moduleProgress[moduleId].attempts + 1,
        },
      },
    }))
  }, [])

  const masterModule = React.useCallback((moduleId: string) => {
    setState((s) => {
      const next = { ...s.moduleProgress }
      next[moduleId] = { ...next[moduleId], mastered: true, status: "mastered", examScore: 100 }
      // Unlock the module that depends on this one.
      const dependent = MODULES.find((m) => m.prerequisiteId === moduleId)
      if (dependent && next[dependent.id].status === "locked") {
        next[dependent.id] = { ...next[dependent.id], status: "available" }
      }
      return { ...s, moduleProgress: next }
    })
  }, [])

  const addReviewItems = React.useCallback((items: ReviewItem[]) => {
    if (items.length === 0) return
    setState((s) => {
      const existingIds = new Set(s.reviewQueue.map((i) => i.questionId))
      const merged = [...s.reviewQueue]
      for (const item of items) {
        if (!existingIds.has(item.questionId)) merged.push(item)
      }
      return { ...s, reviewQueue: merged }
    })
  }, [])

  const removeReviewItem = React.useCallback((questionId: string) => {
    setState((s) => ({
      ...s,
      reviewQueue: s.reviewQueue.filter((i) => i.questionId !== questionId),
    }))
  }, [])

  const completeSimulation = React.useCallback((id: string, score: number) => {
    setState((s) => {
      const sims = { ...s.simulations }
      const current = sims[id]
      if (!current) return s
      sims[id] = {
        ...current,
        completed: true,
        bestScore: current.bestScore === null ? score : Math.max(current.bestScore, score),
      }
      // Unlock the next simulation in sequence.
      const idx = SIMULATION_IDS.indexOf(id)
      const nextId = SIMULATION_IDS[idx + 1]
      if (nextId && sims[nextId]) {
        sims[nextId] = { ...sims[nextId], unlocked: true }
      }
      return { ...s, simulations: sims }
    })
  }, [])

  const resetProgress = React.useCallback(() => {
    setState(initialState())
  }, [])

  const setLanguage = React.useCallback((lang: "pt" | "es" | "en") => {
    localStorage.setItem("app_language", lang)
    setState((s) => ({ ...s, language: lang }))
  }, [])

  const isModuleUnlocked = React.useCallback(
    (moduleId: string) => {
      const mp = state.moduleProgress[moduleId]
      return !!mp && mp.status !== "locked"
    },
    [state.moduleProgress],
  )

  const moduleMastery = React.useCallback(
    (moduleId: string) => {
      const mp = state.moduleProgress[moduleId]
      if (!mp) return 0
      if (mp.mastered) return 100
      let pts = 0
      if (mp.diagnosticDone) pts += 20
      if (mp.theoryRead) pts += 25
      if (mp.drillsPassed) pts += 25
      if (mp.examScore !== null) pts += Math.round((mp.examScore / 100) * 30)
      return Math.min(pts, 99)
    },
    [state.moduleProgress],
  )

  const navigate = React.useCallback(
    (target: { view: AppState["activeView"]; moduleId?: string }) => {
      if (target.view === "module" && target.moduleId) {
        openModule(target.moduleId)
      } else {
        setActiveView(target.view)
      }
    },
    [openModule, setActiveView],
  )

  const masteredCount = React.useMemo(
    () => Object.values(state.moduleProgress).filter((m) => m.mastered).length,
    [state.moduleProgress],
  )

  const overallMastery = React.useMemo(
    () => Math.round((masteredCount / MODULES.length) * 100),
    [masteredCount],
  )

  const value: StoreContextValue = {
    state,
    hydrated,
    setOnboardingStep,
    setCandidate,
    selectContest,
    completeOnboarding,
    setActiveView,
    openModule,
    recordDiagnostic,
    markTheoryRead,
    markDrillsPassed,
    recordExam,
    masterModule,
    addReviewItems,
    removeReviewItem,
    completeSimulation,
    resetProgress,
    setLanguage,
    setProfileData,
    overallMastery,
    masteredCount,
    isModuleUnlocked,
    moduleMastery,
    navigate,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within a StoreProvider")
  return ctx
}
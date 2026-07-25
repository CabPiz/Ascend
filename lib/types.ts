export type Language = "pt" | "es" | "en"

export interface AppState {
  onboardingStep: number
  candidate: Candidate | null
  selectedContestId: string | null
  onboardingComplete: boolean
  moduleProgress: Record<string, ModuleProgress>
  simulations: Record<string, SimulationState>
  reviewQueue: ReviewItem[]
  activeView: "onboarding" | "dashboard" | "module" | "simulations" | "review" | "profile"
  activeModuleId: string | null
  language: Language
}

export type ExamBoard = "Cebraspe" | "FGV" | "FCC"

export type WorkMode = "100% Remoto" | "Híbrido" | "Presencial"

export interface Contest {
  id: string
  title: Record<Language, string> | string
  organization: string
  board: ExamBoard
  salary: number
  workMode: WorkMode
  vacancies: number
  registrationLink: string
  /** ISO date string for the registration deadline */
  registrationDeadline: string
  summary: Record<Language, string> | string
  tags: string[]
}

export interface BoardProfile {
  board: ExamBoard
  fullName: string
  style: Record<Language, string> | string
  trapPatterns: Record<Language, string[]> | string[]
}

export interface Question {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
  topic: string
}

export interface TheorySection {
  heading: string
  body: string
}

export interface Module {
  id: string
  title: string
  code: string
  description: string
  /** id of the module that must be mastered first, or null for the first module */
  prerequisiteId: string | null
  estimatedHours: number
  theory: TheorySection[]
  diagnostic: Question[]
  drills: Question[]
  exam: Question[]
}

export type ModulePhase = "diagnostic" | "theory" | "drills" | "exam"

export interface ModuleProgress {
  status: "locked" | "available" | "in-progress" | "mastered"
  diagnosticScore: number | null
  diagnosticDone: boolean
  theoryRead: boolean
  drillsPassed: boolean
  examScore: number | null
  attempts: number
  mastered: boolean
}

export interface SimulationState {
  id: string
  unlocked: boolean
  completed: boolean
  bestScore: number | null
}

export interface Candidate {
  fileName: string
  name: string
  summary: string
  skills: string[]
  seniority: string
}

export interface ReviewItem {
  questionId: string
  moduleId: string
  topic: string
  prompt: string
  addedAt: number
}

export interface ChatMessage {
  role: "user" | "professor"
  content: string
}
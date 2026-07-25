import { Database, Network, ShieldCheck, Workflow, type LucideIcon } from "lucide-react"
import type { ModuleProgress } from "./types"

export const MODULE_ICONS: Record<string, LucideIcon> = {
  "cobit-2019": ShieldCheck,
  "itil-4": Workflow,
  "sql-databases": Database,
  "software-architecture": Network,
}

export function moduleIcon(id: string): LucideIcon {
  return MODULE_ICONS[id] ?? ShieldCheck
}

/** Phase completion checklist for the 4-phase pedagogical loop. */
export function phaseChecklist(p: ModuleProgress) {
  return [
    { key: "diagnostic", label: "Diagnostic", done: p.diagnosticDone },
    { key: "theory", label: "Theory & Q&A", done: p.theoryRead },
    { key: "drills", label: "Practice drills", done: p.drillsPassed },
    { key: "exam", label: "Module exam", done: p.mastered },
  ]
}

/** 0-100 progress through the module's four phases. */
export function modulePercent(p: ModuleProgress): number {
  if (p.mastered) return 100
  const steps = phaseChecklist(p)
  const done = steps.filter((s) => s.done).length
  return Math.round((done / steps.length) * 100)
}

export const STATUS_LABEL: Record<ModuleProgress["status"], string> = {
  locked: "Locked",
  available: "Ready to start",
  "in-progress": "In progress",
  mastered: "Mastered",
}

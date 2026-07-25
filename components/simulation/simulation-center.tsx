"use client"

import * as React from "react"
import { Timer, Lock, Trophy, Target, RotateCw, CheckCircle2, PlayCircle } from "lucide-react"
import type { Question } from "@/lib/types"
import { useStore } from "@/lib/store"
import { MODULES, SIMULATION_IDS, getContest, BOARD_PROFILES } from "@/lib/curriculum"
import { Quiz, type QuizResult } from "@/components/quiz"
import { ReviewQueue } from "@/components/simulation/review-queue"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIM_META: Record<string, { title: string; subtitle: string; minutes: number; questions: number }> = {
  "sim-1": { title: "Mock Exam I", subtitle: "Foundations pass", minutes: 30, questions: 8 },
  "sim-2": { title: "Mock Exam II", subtitle: "Mixed difficulty", minutes: 40, questions: 10 },
  "sim-3": { title: "Full Simulation", subtitle: "Real contest conditions", minutes: 60, questions: 12 },
}

/** Pull a spread of exam questions across every module. */
function buildSimQuestions(count: number): Question[] {
  const pool: Question[] = []
  MODULES.forEach((m) => pool.push(...m.exam, ...m.drills))
  // Deterministic shuffle based on index so it's stable per render session.
  const shuffled = [...pool].sort((a, b) => a.id.localeCompare(b.id))
  const step = Math.max(1, Math.floor(shuffled.length / count))
  const picked: Question[] = []
  for (let i = 0; i < shuffled.length && picked.length < count; i += step) {
    picked.push(shuffled[i])
  }
  return picked
}

export function SimulationCenter() {
  const { state, completeSimulation, overallMastery } = useStore()
  const contest = getContest(state.selectedContestId)
  const board = contest ? BOARD_PROFILES[contest.board] : undefined

  const [activeSim, setActiveSim] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<{ id: string; result: QuizResult } | null>(null)

  const questions = React.useMemo(
    () => (activeSim ? buildSimQuestions(SIM_META[activeSim].questions) : []),
    [activeSim],
  )

  const allMastered = overallMastery === 100

  function onSimComplete(id: string, r: QuizResult) {
    completeSimulation(id, r.score)
    setResult({ id, result: r })
    setActiveSim(null)
  }

  if (activeSim) {
    const meta = SIM_META[activeSim]
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-8">
        <SimRunnerHeader title={meta.title} minutes={meta.minutes} onAbort={() => setActiveSim(null)} />
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <Quiz
            questions={questions}
            mode="linear"
            reveal="deferred"
            submitLabel="Submit simulation"
            onComplete={(r) => onSimComplete(activeSim, r)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Exam Simulation Center</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
          Test under real conditions
        </h1>
        {board && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground text-pretty">
            Tuned to the <span className="font-medium text-foreground">{board.fullName}</span> style: {board.style}
          </p>
        )}
      </header>

      {result && (
        <div
          className={cn(
            "flex items-center gap-4 rounded-2xl border p-5",
            result.result.score >= 70 ? "border-success/40 bg-success/10" : "border-warning/40 bg-warning/10",
          )}
        >
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl",
              result.result.score >= 70 ? "bg-success/20 text-success" : "bg-warning/20 text-warning",
            )}
          >
            <Target className="size-6" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {SIM_META[result.id].title}: {result.result.score}%
            </p>
            <p className="text-sm text-muted-foreground">
              {result.result.correctCount} / {result.result.total} correct. Missed questions were added to your review
              queue below.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setResult(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {!allMastered && (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-pretty">
            Simulations pull from the entire curriculum. You can run them anytime to benchmark yourself, but for the
            most accurate result, clear all modules first. Current mastery:{" "}
            <span className="font-medium text-foreground">{overallMastery}%</span>.
          </p>
        </div>
      )}

      {/* Simulation cards */}
      <section className="grid gap-4 md:grid-cols-3">
        {SIMULATION_IDS.map((id) => {
          const meta = SIM_META[id]
          const sim = state.simulations[id]
          const locked = !sim.unlocked
          return (
            <div
              key={id}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border p-5",
                locked ? "border-border/60 bg-card/40" : "border-border bg-card",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl",
                    sim.completed ? "bg-success/15 text-success" : locked ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary",
                  )}
                >
                  {sim.completed ? <CheckCircle2 className="size-5" /> : locked ? <Lock className="size-4" /> : <PlayCircle className="size-5" />}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Timer className="size-3.5" /> {meta.minutes} min
                </span>
              </div>
              <div>
                <h3 className={cn("font-semibold", locked ? "text-muted-foreground" : "text-foreground")}>{meta.title}</h3>
                <p className="text-sm text-muted-foreground">{meta.subtitle}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{meta.questions} questions</span>
                {sim.bestScore !== null && (
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Trophy className="size-3.5 text-primary" /> Best {sim.bestScore}%
                  </span>
                )}
              </div>
              <Button
                className="w-full"
                variant={sim.completed ? "outline" : "default"}
                disabled={locked}
                onClick={() => {
                  setResult(null)
                  setActiveSim(id)
                }}
              >
                {locked ? (
                  "Locked"
                ) : sim.completed ? (
                  <>
                    <RotateCw className="size-4" /> Retake
                  </>
                ) : (
                  <>
                    <PlayCircle className="size-4" /> Begin
                  </>
                )}
              </Button>
              {locked && <p className="text-center text-xs text-muted-foreground">Clear the previous simulation to unlock.</p>}
            </div>
          )
        })}
      </section>

      {/* Spaced repetition review queue */}
      <ReviewQueue />
    </div>
  )
}

function SimRunnerHeader({ title, minutes, onAbort }: { title: string; minutes: number; onAbort: () => void }) {
  const [secondsLeft, setSecondsLeft] = React.useState(minutes * 60)

  React.useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const ss = String(secondsLeft % 60).padStart(2, "0")
  const low = secondsLeft < 60

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Simulation in progress</p>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums",
            low ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-border bg-card text-foreground",
          )}
        >
          <Timer className="size-4" />
          {mm}:{ss}
        </span>
        <Button variant="ghost" size="sm" onClick={onAbort}>
          Exit
        </Button>
      </div>
    </div>
  )
}

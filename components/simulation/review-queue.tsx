"use client"

import * as React from "react"
import { Repeat2, Check, X, Sparkles, BrainCircuit } from "lucide-react"
import type { Question } from "@/lib/types"
import { useStore } from "@/lib/store"
import { MODULES } from "@/lib/curriculum"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Look up the full Question object referenced by a review item. */
function findQuestion(questionId: string): Question | undefined {
  for (const m of MODULES) {
    const q = [...m.diagnostic, ...m.drills, ...m.exam].find((x) => x.id === questionId)
    if (q) return q
  }
  return undefined
}

export function ReviewQueue() {
  const { state, removeReviewItem } = useStore()
  const queue = state.reviewQueue

  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<number | null>(null)

  const activeQuestion = activeId ? findQuestion(activeId) : undefined

  function grade(correct: boolean) {
    if (!activeId) return
    // In spaced repetition, a correct recall removes the card; a miss keeps it.
    if (correct) removeReviewItem(activeId)
    setActiveId(null)
    setSelected(null)
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-warning/15 text-warning">
          <BrainCircuit className="size-4" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Spaced Repetition Review</h2>
          <p className="text-sm text-muted-foreground">
            Questions you missed anywhere in the app land here until you recall them correctly.
          </p>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <Sparkles className="size-6 text-success" />
          <p className="font-medium text-foreground">Your review queue is empty</p>
          <p className="max-w-sm text-sm text-muted-foreground text-pretty">
            Nothing to review right now. Missed questions from diagnostics, drills, exams, and simulations will appear
            here automatically.
          </p>
        </div>
      ) : activeQuestion ? (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {activeQuestion.topic}
            </span>
            <span className="text-xs text-muted-foreground">Recall check</span>
          </div>
          <p className="mb-4 text-base font-medium leading-relaxed text-foreground text-pretty">
            {activeQuestion.prompt}
          </p>
          <div className="flex flex-col gap-2">
            {activeQuestion.options.map((opt, i) => {
              const isRight = i === activeQuestion.correctIndex
              const isSel = selected === i
              let cls = "border-border bg-background hover:border-primary/50"
              if (selected !== null) {
                if (isRight) cls = "border-success/60 bg-success/10"
                else if (isSel) cls = "border-destructive/60 bg-destructive/10"
                else cls = "border-border bg-background opacity-60"
              }
              return (
                <button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm text-foreground transition-colors",
                    cls,
                  )}
                >
                  {opt}
                  {selected !== null && isRight && <Check className="size-4 text-success" />}
                  {selected !== null && isSel && !isRight && <X className="size-4 text-destructive" />}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <>
              <div className="mt-4 rounded-lg border border-border bg-background/60 p-3 text-sm text-muted-foreground">
                {activeQuestion.explanation}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => grade(false)}>
                  Keep for later
                </Button>
                <Button
                  onClick={() => grade(selected === activeQuestion.correctIndex)}
                  disabled={selected !== activeQuestion.correctIndex}
                >
                  <Check className="size-4" /> Got it — remove
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {queue.map((item) => {
            const mod = MODULES.find((m) => m.id === item.moduleId)
            return (
              <li
                key={item.questionId}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
                  <Repeat2 className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.prompt}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.topic}
                    {mod ? ` · ${mod.title}` : ""}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveId(item.questionId)}>
                  Review
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

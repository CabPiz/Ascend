"use client"

import * as React from "react"
import { Check, X, ArrowRight, RotateCw } from "lucide-react"
import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface QuizResult {
  score: number
  correctCount: number
  total: number
  wrongQuestions: Question[]
}

interface QuizProps {
  questions: Question[]
  /**
   * linear: go through each question once, compute a final score.
   * drill: recycle any question answered incorrectly until every one is passed.
   */
  mode: "linear" | "drill"
  /** immediate reveals feedback per question; deferred hides it until submission. */
  reveal?: "immediate" | "deferred"
  submitLabel?: string
  onComplete: (result: QuizResult) => void
}

export function Quiz({ questions, mode, reveal = "immediate", submitLabel = "Finish", onComplete }: QuizProps) {
  // For drill mode we work off a mutable queue; for linear we walk the array.
  const [queue, setQueue] = React.useState<Question[]>(questions)
  const [index, setIndex] = React.useState(0)
  const [selected, setSelected] = React.useState<number | null>(null)
  const [locked, setLocked] = React.useState(false)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [attempted, setAttempted] = React.useState(0)
  const wrongSet = React.useRef<Map<string, Question>>(new Map())
  const passedCount = React.useRef(0)

  const current = queue[index]

  function choose(optionIndex: number) {
    if (locked && reveal === "immediate") return
    setSelected(optionIndex)
    if (reveal === "deferred") return
    setLocked(true)
    const isCorrect = optionIndex === current.correctIndex
    setAttempted((a) => a + 1)
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
      passedCount.current += 1
    } else {
      wrongSet.current.set(current.id, current)
    }
  }

  function next() {
    const isCorrect = selected === current.correctIndex

    if (mode === "drill") {
      if (isCorrect) {
        // Advance; drill is done when we've passed as many as there are unique questions.
        if (passedCount.current >= questions.length) {
          finish()
          return
        }
        setIndex((i) => i + 1)
      } else {
        // Recycle this question to the back of the queue for another attempt.
        setQueue((q) => [...q, current])
        setIndex((i) => i + 1)
      }
      setSelected(null)
      setLocked(false)
      return
    }

    // linear
    if (index + 1 >= queue.length) {
      finish(selected)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setLocked(false)
  }

  function finish(lastSelected?: number | null) {
    let finalCorrect = correctCount
    const wrong: Question[] = []

    if (reveal === "deferred") {
      // Score everything now (deferred mode doesn't track per-question live).
      finalCorrect = 0
      queue.forEach((q, i) => {
        const ans = deferredAnswers.current[i]
        if (ans === q.correctIndex) finalCorrect += 1
        else wrong.push(q)
      })
    } else {
      // immediate: account for the final question if it was correct-counted already
      wrongSet.current.forEach((q) => wrong.push(q))
      // de-duplicate wrong list against ones eventually passed in drill mode
    }

    const total = questions.length
    const score = Math.round((finalCorrect / total) * 100)
    onComplete({ score, correctCount: finalCorrect, total, wrongQuestions: wrong })
  }

  // Deferred-mode answer tracking.
  const deferredAnswers = React.useRef<Record<number, number>>({})
  function chooseDeferred(optionIndex: number) {
    setSelected(optionIndex)
    deferredAnswers.current[index] = optionIndex
  }
  function nextDeferred() {
    if (index + 1 >= queue.length) {
      finish()
      return
    }
    setIndex((i) => i + 1)
    setSelected(deferredAnswers.current[index + 1] ?? null)
  }

  if (!current) return null

  const progressText =
    mode === "drill"
      ? `${Math.min(passedCount.current, questions.length)} / ${questions.length} passed`
      : `Question ${index + 1} / ${queue.length}`

  const isCorrect = selected === current.correctIndex
  const showFeedback = reveal === "immediate" && locked

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-md bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
            {current.topic}
          </span>
        </span>
        <span className="tabular-nums">{progressText}</span>
      </div>

      <p className="text-base font-medium leading-relaxed text-foreground text-pretty">{current.prompt}</p>

      <div className="flex flex-col gap-2">
        {current.options.map((option, i) => {
          const isSelected = selected === i
          const isRight = i === current.correctIndex
          let stateClass = "border-border bg-card hover:border-primary/50 hover:bg-accent"
          if (reveal === "immediate" && locked) {
            if (isRight) stateClass = "border-success/60 bg-success/10 text-foreground"
            else if (isSelected) stateClass = "border-destructive/60 bg-destructive/10 text-foreground"
            else stateClass = "border-border bg-card opacity-60"
          } else if (isSelected) {
            stateClass = "border-primary bg-primary/10 text-foreground"
          }
          return (
            <button
              key={i}
              onClick={() => (reveal === "immediate" ? choose(i) : chooseDeferred(i))}
              disabled={reveal === "immediate" && locked}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                stateClass,
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </span>
              {reveal === "immediate" && locked && isRight && <Check className="size-4 text-success" />}
              {reveal === "immediate" && locked && isSelected && !isRight && <X className="size-4 text-destructive" />}
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            isCorrect ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10",
          )}
        >
          <p className={cn("mb-1 font-semibold", isCorrect ? "text-success" : "text-destructive")}>
            {isCorrect ? "Correct" : mode === "drill" ? "Not quite — this one will come back" : "Incorrect"}
          </p>
          <p className="text-muted-foreground">{current.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {reveal === "immediate" ? (
          <Button onClick={next} disabled={!locked}>
            {mode === "drill" && !isCorrect ? (
              <>
                Retry queued <RotateCw className="size-4" />
              </>
            ) : (
              <>
                {index + 1 >= queue.length && mode === "linear" ? submitLabel : "Continue"}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={nextDeferred} disabled={selected === null}>
            {index + 1 >= queue.length ? submitLabel : "Next"}
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
